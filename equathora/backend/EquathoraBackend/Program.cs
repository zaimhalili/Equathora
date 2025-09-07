var builder = WebApplication.CreateBuilder(args);

// OpenAPI remains
builder.Services.AddOpenApi();

// ✅ Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors("AllowReactDev");

// Optional: comment out HTTPS redirect for dev
// app.UseHttpsRedirection();

// OpenAPI mapping
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Example: Generate random math problems
app.MapGet("/mathproblem", () =>
{
    var random = new Random();
    int a = random.Next(1, 100);
    int b = random.Next(1, 100);
    string[] ops = { "+", "-", "*", "/" };
    string op = ops[random.Next(ops.Length)];

    // Avoid division by zero
    if (op == "/") b = random.Next(1, 20);

    string question = $"{a} {op} {b}";
    double answer = op switch
    {
        "+" => a + b,
        "-" => a - b,
        "*" => a * b,
        "/" => Math.Round((double)a / b, 2),
        _ => 0
    };

    return Results.Ok(new { question, answer });
})
.WithName("GetMathProblem");

app.Run();
