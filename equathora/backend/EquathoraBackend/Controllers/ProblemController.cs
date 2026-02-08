using Microsoft.AspNetCore.Mvc;
using MathNet.Numerics;
using MathNet.Symbolics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EquathoraBackend.Controllers
{
    [ApiController]
    [Route("api")]
    public class ProblemController : ControllerBase
    {
        [HttpPost("validate-step")]
        public IActionResult ValidateAnswer([FromBody] AnswerValidationRequest request)
        {
            try
            {
                var userAnswer = request.UserAnswer?.Trim();
                var problem = request.Problem;

                if (string.IsNullOrWhiteSpace(userAnswer))
                {
                    return Ok(new
                    {
                        isCorrect = false,
                        feedback = "Please provide an answer.",
                        score = 0
                    });
                }

                // Get accepted answers from problem
                var acceptedAnswers = problem?.AcceptedAnswers ?? new List<string>();
                if (acceptedAnswers.Count == 0 && !string.IsNullOrWhiteSpace(problem?.Answer))
                {
                    acceptedAnswers.Add(problem.Answer);
                }

                if (acceptedAnswers.Count == 0)
                {
                    return Ok(new
                    {
                        isCorrect = false,
                        feedback = "No correct answer defined for this problem.",
                        score = 0
                    });
                }

                // Try exact string comparison first (normalized)
                var normalizedUserAnswer = NormalizeAnswer(userAnswer);
                foreach (var accepted in acceptedAnswers)
                {
                    var normalizedAccepted = NormalizeAnswer(accepted);
                    if (normalizedUserAnswer == normalizedAccepted)
                    {
                        return Ok(new
                        {
                            isCorrect = true,
                            feedback = "Perfect! Your answer is correct!",
                            score = 1
                        });
                    }
                }

                // Try Math.NET symbolic comparison
                try
                {
                    var userExpr = Infix.ParseOrThrow(userAnswer);

                    foreach (var accepted in acceptedAnswers)
                    {
                        try
                        {
                            var acceptedExpr = Infix.ParseOrThrow(accepted);

                            // Check if expressions are symbolically equivalent
                            if (userExpr.Equals(acceptedExpr))
                            {
                                return Ok(new
                                {
                                    isCorrect = true,
                                    feedback = "Correct! Your answer is mathematically equivalent.",
                                    score = 1
                                });
                            }
                        }
                        catch
                        {
                            // Skip this accepted answer if it can't be parsed
                            continue;
                        }
                    }
                }
                catch (Exception ex)
                {
                    // If Math.NET parsing fails, try numerical comparison
                    if (double.TryParse(userAnswer, out double userNum))
                    {
                        foreach (var accepted in acceptedAnswers)
                        {
                            if (double.TryParse(accepted, out double acceptedNum))
                            {
                                if (Math.Abs(userNum - acceptedNum) < 0.0001)
                                {
                                    return Ok(new
                                    {
                                        isCorrect = true,
                                        feedback = "Correct! Your numerical answer matches.",
                                        score = 1
                                    });
                                }
                            }
                        }
                    }
                }

                return Ok(new
                {
                    isCorrect = false,
                    feedback = "Incorrect answer. Please try again.",
                    score = 0
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    isCorrect = false,
                    feedback = $"Error validating answer: {ex.Message}",
                    score = 0
                });
            }
        }

        [HttpPost("problem/validate-step")]
        public IActionResult ValidateSteps([FromBody] StepValidationRequest request)
        {
            try
            {
                var steps = request.Steps;
                var correctSteps = request.CorrectSteps;
                var feedback = new List<string>();

                for (int i = 0; i < steps.Count; i++)
                {
                    if (i >= correctSteps.Count)
                    {
                        feedback.Add($"Step {i + 1}: No corresponding correct step to compare.");
                        continue;
                    }

                    var userStep = Infix.ParseOrThrow(steps[i]);
                    var correctStep = Infix.ParseOrThrow(correctSteps[i]);

                    if (userStep.Equals(correctStep))
                    {
                        feedback.Add($"Step {i + 1}: Correct.");
                    }
                    else
                    {
                        feedback.Add($"Step {i + 1}: Incorrect. Expected: {correctSteps[i]}.");
                    }
                }

                return Ok(new { feedback });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private string NormalizeAnswer(string answer)
        {
            if (string.IsNullOrWhiteSpace(answer))
                return "";

            return answer
                .ToLower()
                .Trim()
                .Replace(" ", "")
                .Replace(",", "")
                .Replace("$", "")
                .Replace("°", "")
                .Replace("×", "*")
                .Replace("·", "*")
                .Replace("⋅", "*")
                .Replace("−", "-")
                .Replace("–", "-")
                .Replace("—", "-");
        }
    }

    public class AnswerValidationRequest
    {
        public string UserAnswer { get; set; } = "";
        public ProblemData? Problem { get; set; }
    }

    public class ProblemData
    {
        public string? Answer { get; set; }
        public List<string>? AcceptedAnswers { get; set; }
    }

    public class StepValidationRequest
    {
        public List<string> Steps { get; set; } = new List<string>();
        public List<string> CorrectSteps { get; set; } = new List<string>();
    }
}