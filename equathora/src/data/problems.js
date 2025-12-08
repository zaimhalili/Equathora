// Real math problems for MVP launch
// Structure: { id, groupId, title, difficulty, description, answer, hints, solution, premium }

export const problemGroups = [
    { id: 1, name: "Algebra Fundamentals", description: "Master basic algebraic equations and expressions" },
    { id: 2, name: "Geometry Basics", description: "Explore shapes, areas, and perimeters" },
    { id: 3, name: "Logic & Puzzles", description: "Develop critical thinking with logic problems" },
    { id: 4, name: "Word Problems", description: "Apply math to real-world scenarios" }
];

export const problems = [
    // ALGEBRA FUNDAMENTALS (Group 1)
    {
        id: 1,
        groupId: 1,
        title: "Solve for x: 2x + 5 = 13",
        difficulty: "Easy",
        description: "Find the value of x in the equation 2x + 5 = 13",
        answer: "4",
        acceptedAnswers: ["4", "4.0", "x=4", "x = 4"],
        hints: [
            "Start by isolating the term with x on one side",
            "Subtract 5 from both sides of the equation",
            "Then divide both sides by 2 to get x alone"
        ],
        solution: "Step 1: 2x + 5 = 13\nStep 2: 2x = 13 - 5\nStep 3: 2x = 8\nStep 4: x = 8 ÷ 2\nStep 5: x = 4",
        premium: false,
        topic: "Linear Equations"
    },
    {
        id: 2,
        groupId: 1,
        title: "Simplify: 3(x + 4) - 2x",
        difficulty: "Easy",
        description: "Simplify the algebraic expression 3(x + 4) - 2x",
        answer: "x+12",
        acceptedAnswers: ["x+12", "x + 12", "12+x", "12 + x"],
        hints: [
            "First, distribute the 3 to both terms inside the parentheses",
            "Then combine like terms",
            "Remember: 3x - 2x = x"
        ],
        solution: "Step 1: 3(x + 4) - 2x\nStep 2: 3x + 12 - 2x\nStep 3: (3x - 2x) + 12\nStep 4: x + 12",
        premium: false,
        topic: "Algebraic Expressions"
    },
    {
        id: 3,
        groupId: 1,
        title: "Solve: 5x - 7 = 2x + 8",
        difficulty: "Medium",
        description: "Find x when 5x - 7 = 2x + 8",
        answer: "5",
        acceptedAnswers: ["5", "5.0", "x=5", "x = 5"],
        hints: [
            "Move all x terms to one side and constants to the other",
            "Subtract 2x from both sides first",
            "Then add 7 to both sides"
        ],
        solution: "Step 1: 5x - 7 = 2x + 8\nStep 2: 5x - 2x = 8 + 7\nStep 3: 3x = 15\nStep 4: x = 15 ÷ 3\nStep 5: x = 5",
        premium: false,
        topic: "Linear Equations"
    },
    {
        id: 4,
        groupId: 1,
        title: "Expand: (x + 3)(x + 2)",
        difficulty: "Medium",
        description: "Expand the expression (x + 3)(x + 2) using FOIL",
        answer: "x²+5x+6",
        acceptedAnswers: ["x²+5x+6", "x^2+5x+6", "x² + 5x + 6", "x^2 + 5x + 6"],
        hints: [
            "Use FOIL method: First, Outer, Inner, Last",
            "First: x × x = x²",
            "Combine the middle terms: 2x + 3x = 5x"
        ],
        solution: "Step 1: (x + 3)(x + 2)\nStep 2: x² + 2x + 3x + 6\nStep 3: x² + 5x + 6",
        premium: false,
        topic: "Quadratic Expressions"
    },
    {
        id: 5,
        groupId: 1,
        title: "Solve: x² - 9 = 0",
        difficulty: "Medium",
        description: "Find all values of x where x² - 9 = 0",
        answer: "±3",
        acceptedAnswers: ["±3", "+3,-3", "3,-3", "-3,3", "3 or -3", "x=3 or x=-3"],
        hints: [
            "This is a difference of squares",
            "Factor: x² - 9 = (x + 3)(x - 3)",
            "Set each factor equal to zero"
        ],
        solution: "Step 1: x² - 9 = 0\nStep 2: (x + 3)(x - 3) = 0\nStep 3: x + 3 = 0 or x - 3 = 0\nStep 4: x = -3 or x = 3",
        premium: false,
        topic: "Quadratic Equations"
    },

    // GEOMETRY BASICS (Group 2)
    {
        id: 6,
        groupId: 2,
        title: "Area of Rectangle",
        difficulty: "Easy",
        description: "Find the area of a rectangle with length 8 cm and width 5 cm",
        answer: "40",
        acceptedAnswers: ["40", "40cm²", "40 cm²", "40 square cm"],
        hints: [
            "Area of rectangle = length × width",
            "Multiply 8 by 5",
            "Don't forget the units (cm²)"
        ],
        solution: "Area = length × width\nArea = 8 cm × 5 cm\nArea = 40 cm²",
        premium: false,
        topic: "Area"
    },
    {
        id: 7,
        groupId: 2,
        title: "Perimeter of Square",
        difficulty: "Easy",
        description: "A square has sides of 7 inches. What is its perimeter?",
        answer: "28",
        acceptedAnswers: ["28", "28in", "28 in", "28 inches"],
        hints: [
            "A square has 4 equal sides",
            "Perimeter = side + side + side + side",
            "Or: Perimeter = 4 × side"
        ],
        solution: "Perimeter = 4 × side\nPerimeter = 4 × 7 inches\nPerimeter = 28 inches",
        premium: false,
        topic: "Perimeter"
    },
    {
        id: 8,
        groupId: 2,
        title: "Area of Triangle",
        difficulty: "Medium",
        description: "Find the area of a triangle with base 10 cm and height 6 cm",
        answer: "30",
        acceptedAnswers: ["30", "30cm²", "30 cm²", "30 square cm"],
        hints: [
            "Area of triangle = ½ × base × height",
            "Multiply base (10) by height (6), then divide by 2",
            "10 × 6 = 60, then 60 ÷ 2 = ?"
        ],
        solution: "Area = ½ × base × height\nArea = ½ × 10 cm × 6 cm\nArea = ½ × 60 cm²\nArea = 30 cm²",
        premium: false,
        topic: "Area"
    },
    {
        id: 9,
        groupId: 2,
        title: "Circumference of Circle",
        difficulty: "Medium",
        description: "Find the circumference of a circle with radius 5 cm (use π ≈ 3.14)",
        answer: "31.4",
        acceptedAnswers: ["31.4", "31.4cm", "31.4 cm", "10π", "10π cm"],
        hints: [
            "Circumference = 2πr, where r is radius",
            "Substitute r = 5 and π = 3.14",
            "2 × 3.14 × 5 = ?"
        ],
        solution: "Circumference = 2πr\nCircumference = 2 × 3.14 × 5\nCircumference = 31.4 cm",
        premium: false,
        topic: "Circles"
    },
    {
        id: 10,
        groupId: 2,
        title: "Volume of Cube",
        difficulty: "Medium",
        description: "Find the volume of a cube with side length 4 meters",
        answer: "64",
        acceptedAnswers: ["64", "64m³", "64 m³", "64 cubic meters"],
        hints: [
            "Volume of cube = side³",
            "Calculate 4 × 4 × 4",
            "This is 4 cubed or 4³"
        ],
        solution: "Volume = side³\nVolume = 4³\nVolume = 4 × 4 × 4\nVolume = 64 m³",
        premium: false,
        topic: "Volume"
    },

    // LOGIC & PUZZLES (Group 3)
    {
        id: 11,
        groupId: 3,
        title: "Number Pattern",
        difficulty: "Easy",
        description: "What comes next in the sequence: 2, 4, 6, 8, ?",
        answer: "10",
        acceptedAnswers: ["10"],
        hints: [
            "Look for a pattern in how the numbers change",
            "Each number increases by 2",
            "8 + 2 = ?"
        ],
        solution: "This is a sequence of even numbers increasing by 2.\n2, 4 (+2), 6 (+2), 8 (+2), 10",
        premium: false,
        topic: "Patterns"
    },
    {
        id: 12,
        groupId: 3,
        title: "Age Puzzle",
        difficulty: "Medium",
        description: "Sarah is 12 years old. Her mother is 3 times her age. How old is Sarah's mother?",
        answer: "36",
        acceptedAnswers: ["36", "36 years", "36 years old"],
        hints: [
            "3 times means multiply by 3",
            "Mother's age = Sarah's age × 3",
            "12 × 3 = ?"
        ],
        solution: "Mother's age = 3 × Sarah's age\nMother's age = 3 × 12\nMother's age = 36 years old",
        premium: false,
        topic: "Logic"
    },
    {
        id: 13,
        groupId: 3,
        title: "Odd One Out",
        difficulty: "Easy",
        description: "Which number doesn't belong: 2, 4, 7, 8, 10?",
        answer: "7",
        acceptedAnswers: ["7"],
        hints: [
            "Look at whether numbers are even or odd",
            "Even numbers are divisible by 2",
            "Which number is odd?"
        ],
        solution: "All numbers except 7 are even (divisible by 2).\n2, 4, 8, 10 are even.\n7 is odd, so it doesn't belong.",
        premium: false,
        topic: "Logic"
    },
    {
        id: 14,
        groupId: 3,
        title: "Fibonacci Sequence",
        difficulty: "Hard",
        description: "What comes next: 1, 1, 2, 3, 5, 8, ?",
        answer: "13",
        acceptedAnswers: ["13"],
        hints: [
            "Each number is the sum of the previous two numbers",
            "1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8",
            "Add the last two numbers: 5 + 8 = ?"
        ],
        solution: "This is the Fibonacci sequence.\nEach term = sum of previous two terms\n5 + 8 = 13",
        premium: false,
        topic: "Patterns"
    },
    {
        id: 15,
        groupId: 3,
        title: "Logic Grid",
        difficulty: "Hard",
        description: "If A = 1, B = 2, C = 3, what is the sum of the letters in 'CAB'?",
        answer: "6",
        acceptedAnswers: ["6"],
        hints: [
            "Find the value of each letter: C, A, B",
            "C = 3, A = 1, B = 2",
            "Add them together: 3 + 1 + 2 = ?"
        ],
        solution: "C = 3, A = 1, B = 2\nSum = 3 + 1 + 2 = 6",
        premium: false,
        topic: "Logic"
    },

    // WORD PROBLEMS (Group 4)
    {
        id: 16,
        groupId: 4,
        title: "Apples Problem",
        difficulty: "Easy",
        description: "Emma has 15 apples. She gives 6 to her friend. How many does she have left?",
        answer: "9",
        acceptedAnswers: ["9", "9 apples"],
        hints: [
            "This is a subtraction problem",
            "Start with 15, take away 6",
            "15 - 6 = ?"
        ],
        solution: "Apples left = Total apples - Apples given\nApples left = 15 - 6\nApples left = 9",
        premium: false,
        topic: "Basic Operations"
    },
    {
        id: 17,
        groupId: 4,
        title: "Money Problem",
        difficulty: "Easy",
        description: "A pencil costs $2 and an eraser costs $1. How much do 3 pencils and 2 erasers cost?",
        answer: "8",
        acceptedAnswers: ["8", "$8", "8 dollars"],
        hints: [
            "Calculate cost of pencils: 3 × $2",
            "Calculate cost of erasers: 2 × $1",
            "Add both costs together"
        ],
        solution: "Pencils cost = 3 × $2 = $6\nErasers cost = 2 × $1 = $2\nTotal = $6 + $2 = $8",
        premium: false,
        topic: "Money"
    },
    {
        id: 18,
        groupId: 4,
        title: "Speed Problem",
        difficulty: "Medium",
        description: "A car travels 120 miles in 2 hours. What is its average speed in miles per hour?",
        answer: "60",
        acceptedAnswers: ["60", "60mph", "60 mph", "60 miles per hour"],
        hints: [
            "Speed = Distance ÷ Time",
            "Distance = 120 miles, Time = 2 hours",
            "120 ÷ 2 = ?"
        ],
        solution: "Speed = Distance ÷ Time\nSpeed = 120 miles ÷ 2 hours\nSpeed = 60 mph",
        premium: false,
        topic: "Speed & Distance"
    },
    {
        id: 19,
        groupId: 4,
        title: "Percentage Problem",
        difficulty: "Medium",
        description: "A shirt originally costs $40. It's on sale for 25% off. What is the sale price?",
        answer: "30",
        acceptedAnswers: ["30", "$30", "30 dollars"],
        hints: [
            "Find 25% of $40 first",
            "25% = 0.25, so 0.25 × 40 = $10",
            "Sale price = Original price - Discount"
        ],
        solution: "Discount = 25% of $40 = 0.25 × 40 = $10\nSale price = $40 - $10 = $30",
        premium: false,
        topic: "Percentages"
    },
    {
        id: 20,
        groupId: 4,
        title: "Work Problem",
        difficulty: "Hard",
        description: "If 3 workers can complete a task in 6 hours, how long would it take 6 workers?",
        answer: "3",
        acceptedAnswers: ["3", "3 hours", "3hrs"],
        hints: [
            "This is an inverse proportion problem",
            "More workers = less time needed",
            "If you double the workers, you halve the time"
        ],
        solution: "Total work = 3 workers × 6 hours = 18 worker-hours\nWith 6 workers: Time = 18 ÷ 6 = 3 hours",
        premium: false,
        topic: "Ratios & Proportions"
    },

    // Additional problems for variety
    {
        id: 21,
        groupId: 1,
        title: "Solve: 3x/2 = 9",
        difficulty: "Medium",
        description: "Find x in the equation 3x/2 = 9",
        answer: "6",
        acceptedAnswers: ["6", "6.0", "x=6"],
        hints: [
            "Multiply both sides by 2 first",
            "This gives you 3x = 18",
            "Then divide by 3"
        ],
        solution: "Step 1: 3x/2 = 9\nStep 2: 3x = 18 (multiply both sides by 2)\nStep 3: x = 6 (divide by 3)",
        premium: false,
        topic: "Linear Equations"
    },
    {
        id: 22,
        groupId: 2,
        title: "Pythagorean Theorem",
        difficulty: "Hard",
        description: "A right triangle has legs of 3 and 4. Find the length of the hypotenuse.",
        answer: "5",
        acceptedAnswers: ["5", "5.0"],
        hints: [
            "Use the Pythagorean theorem: a² + b² = c²",
            "3² + 4² = c²",
            "9 + 16 = 25, so c = √25"
        ],
        solution: "a² + b² = c²\n3² + 4² = c²\n9 + 16 = c²\n25 = c²\nc = √25 = 5",
        premium: false,
        topic: "Triangles"
    },
    {
        id: 23,
        groupId: 3,
        title: "Divisibility",
        difficulty: "Medium",
        description: "How many numbers between 1 and 20 are divisible by 3?",
        answer: "6",
        acceptedAnswers: ["6"],
        hints: [
            "List the multiples of 3 up to 20",
            "3, 6, 9, 12, 15, 18",
            "Count how many there are"
        ],
        solution: "Multiples of 3 between 1 and 20:\n3, 6, 9, 12, 15, 18\nTotal count = 6",
        premium: false,
        topic: "Number Theory"
    },
    {
        id: 24,
        groupId: 4,
        title: "Average Problem",
        difficulty: "Medium",
        description: "The scores on 4 tests are 85, 90, 78, and 95. What is the average score?",
        answer: "87",
        acceptedAnswers: ["87", "87.0"],
        hints: [
            "Average = Sum of all scores ÷ Number of tests",
            "Add: 85 + 90 + 78 + 95",
            "Divide the sum by 4"
        ],
        solution: "Sum = 85 + 90 + 78 + 95 = 348\nAverage = 348 ÷ 4 = 87",
        premium: false,
        topic: "Statistics"
    },
    {
        id: 25,
        groupId: 1,
        title: "Factor: x² - 4",
        difficulty: "Medium",
        description: "Factor the expression x² - 4",
        answer: "(x+2)(x-2)",
        acceptedAnswers: ["(x+2)(x-2)", "(x-2)(x+2)", "(x + 2)(x - 2)", "(x - 2)(x + 2)"],
        hints: [
            "This is a difference of squares",
            "Pattern: a² - b² = (a + b)(a - b)",
            "Here, a = x and b = 2"
        ],
        solution: "x² - 4 = x² - 2²\nThis is a difference of squares\nx² - 2² = (x + 2)(x - 2)",
        premium: false,
        topic: "Factoring"
    },
    {
        id: 26,
        groupId: 2,
        title: "Area of Circle",
        difficulty: "Medium",
        description: "Find the area of a circle with radius 3 cm (use π ≈ 3.14)",
        answer: "28.26",
        acceptedAnswers: ["28.26", "28.26cm²", "28.26 cm²", "9π", "9π cm²"],
        hints: [
            "Area of circle = πr²",
            "Square the radius first: 3² = 9",
            "Then multiply by π: 9 × 3.14"
        ],
        solution: "Area = πr²\nArea = 3.14 × 3²\nArea = 3.14 × 9\nArea = 28.26 cm²",
        premium: false,
        topic: "Circles"
    },
    {
        id: 27,
        groupId: 3,
        title: "Prime Numbers",
        difficulty: "Easy",
        description: "Which of these is a prime number: 15, 17, 18, 20?",
        answer: "17",
        acceptedAnswers: ["17"],
        hints: [
            "A prime number is only divisible by 1 and itself",
            "Check each number for factors",
            "15 = 3×5, 18 = 2×9, 20 = 4×5, but 17...?"
        ],
        solution: "15 = 3 × 5 (not prime)\n17 has no factors other than 1 and 17 (prime!)\n18 = 2 × 9 (not prime)\n20 = 4 × 5 (not prime)",
        premium: false,
        topic: "Number Theory"
    },
    {
        id: 28,
        groupId: 4,
        title: "Ratio Problem",
        difficulty: "Hard",
        description: "In a class, the ratio of boys to girls is 3:2. If there are 15 boys, how many girls are there?",
        answer: "10",
        acceptedAnswers: ["10", "10 girls"],
        hints: [
            "The ratio 3:2 means for every 3 boys, there are 2 girls",
            "Find how many groups of 3 are in 15 boys",
            "15 ÷ 3 = 5 groups, so multiply 2 by 5"
        ],
        solution: "Ratio boys:girls = 3:2\nIf there are 15 boys, that's 15÷3 = 5 groups\nGirls = 2 × 5 = 10",
        premium: false,
        topic: "Ratios"
    },
    {
        id: 29,
        groupId: 1,
        title: "Solve: |x - 3| = 5",
        difficulty: "Hard",
        description: "Solve the absolute value equation |x - 3| = 5",
        answer: "8,-2",
        acceptedAnswers: ["8,-2", "-2,8", "8 or -2", "-2 or 8", "x=8 or x=-2"],
        hints: [
            "Absolute value means distance from zero",
            "|x - 3| = 5 means x - 3 = 5 OR x - 3 = -5",
            "Solve both equations"
        ],
        solution: "Case 1: x - 3 = 5 → x = 8\nCase 2: x - 3 = -5 → x = -2\nSolutions: x = 8 or x = -2",
        premium: false,
        topic: "Absolute Value"
    },
    {
        id: 30,
        groupId: 4,
        title: "Interest Problem",
        difficulty: "Hard",
        description: "You invest $1000 at 5% simple interest per year. How much interest will you earn in 2 years?",
        answer: "100",
        acceptedAnswers: ["100", "$100", "100 dollars"],
        hints: [
            "Simple Interest = Principal × Rate × Time",
            "Principal = $1000, Rate = 5% = 0.05, Time = 2 years",
            "I = 1000 × 0.05 × 2"
        ],
        solution: "Simple Interest = P × R × T\nI = $1000 × 0.05 × 2\nI = $1000 × 0.10\nI = $100",
        premium: false,
        topic: "Finance"
    }
];

// Helper function to get problems by group
export const getProblemsByGroup = (groupId) => {
    return problems.filter(p => p.groupId === groupId);
};

// Helper function to get problem by ID
export const getProblemById = (id) => {
    return problems.find(p => p.id === id);
};

// Helper function to get group by ID
export const getGroupById = (id) => {
    return problemGroups.find(g => g.id === id);
};
