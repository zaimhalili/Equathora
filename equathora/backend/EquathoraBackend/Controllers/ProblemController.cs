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
    [Route("api/[controller]")]
    public class ProblemController : ControllerBase
    {
        [HttpPost("validate-step")]
        public IActionResult ValidateStep([FromBody] StepValidationRequest request)
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
    }

    public class StepValidationRequest
    {
        public List<string> Steps { get; set; }
        public List<string> CorrectSteps { get; set; }
    }
}