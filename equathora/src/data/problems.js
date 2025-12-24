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
        title: "The Movie Theater Ticket Pricing",
        difficulty: "Easy",
        description: "A movie theater charges $12 for adult tickets and sells popcorn for $5 per bag. Maria spent $29 total buying one adult ticket and some bags of popcorn. Write and solve an equation to find how many bags of popcorn Maria bought. Let p represent the number of popcorn bags.",
        answer: "3.4",
        acceptedAnswers: ["3.4", "3.4 bags", "17/5", "3 2/5"],
        hints: [
            "Set up the equation: 12 + 5p = 29, where p is the number of popcorn bags",
            "Subtract 12 from both sides to isolate the term with p",
            "Then divide both sides by 5 to find the value of p"
        ],
        solution: "Step 1: Set up equation: 12 + 5p = 29\nStep 2: Subtract 12 from both sides: 5p = 17\nStep 3: Divide by 5: p = 17/5\nStep 4: p = 3.4 bags",
        premium: false,
        topic: "Linear Equations"
    },
    {
        id: 2,
        groupId: 1,
        title: "Distributing Resources Fairly",
        difficulty: "Easy",
        description: "A teacher has x students in her class. She gives each student 3 pencils and 4 erasers, then keeps 5 extra pencils for herself. Write and simplify an expression for the total number of pencils the teacher started with. Then expand and simplify: 3(x + 4) + 2x - 5",
        answer: "5x+7",
        acceptedAnswers: ["5x+7", "5x + 7", "7+5x", "7 + 5x"],
        hints: [
            "First, distribute the 3 to both terms inside the parentheses: 3x + 12",
            "Then add the 2x term and subtract 5",
            "Combine like terms: 3x + 2x = 5x"
        ],
        solution: "Step 1: 3(x + 4) + 2x - 5\nStep 2: 3x + 12 + 2x - 5\nStep 3: (3x + 2x) + (12 - 5)\nStep 4: 5x + 7",
        premium: false,
        topic: "Algebraic Expressions"
    },
    {
        id: 3,
        groupId: 1,
        title: "The Two Brothers' Age Mystery",
        difficulty: "Medium",
        description: "James is 5 years older than twice his younger brother Tom's age. If James is currently 23 years old, how old is Tom? Set up the equation where t represents Tom's age: 2t + 5 = 23, then solve for t.",
        answer: "9",
        acceptedAnswers: ["9", "9 years", "9 years old", "t=9"],
        hints: [
            "The equation is 2t + 5 = 23, where t is Tom's age",
            "Subtract 5 from both sides to get 2t alone",
            "Then divide both sides by 2 to find t"
        ],
        solution: "Step 1: 2t + 5 = 23\nStep 2: 2t = 23 - 5\nStep 3: 2t = 18\nStep 4: t = 18 ÷ 2\nStep 5: t = 9 years old",
        premium: false,
        topic: "Linear Equations"
    },
    {
        id: 4,
        groupId: 1,
        title: "Garden Plot Dimensions",
        difficulty: "Medium",
        description: "A rectangular garden has a length that is 3 meters more than its width. If we call the width w, we can express the area as w(w + 3). Expand this expression to write the area in standard form. You can also plug in w = 5 to find the specific area for that width (either form is accepted).",
        answer: "w²+3w",
        acceptedAnswers: [
            "w²+3w", "w^2+3w", "w² + 3w", "w^2 + 3w", "3w+w²", "3w+w^2",
            "w(w+3)", "w (w+3)",
            "40", "40 square meters", "40 m^2", "40 sqm", "40 sq meters"
        ],
        hints: [
            "Use the distributive property: w × (w + 3)",
            "Multiply w by each term in the parentheses",
            "w × w = w², and w × 3 = 3w"
        ],
        solution: "Step 1: w(w + 3)\nStep 2: w × w + w × 3\nStep 3: w² + 3w (expanded form)\nOptional check when w = 5: 5² + 3(5) = 25 + 15 = 40 square meters",
        premium: false,
        topic: "Quadratic Expressions"
    },
    {
        id: 5,
        groupId: 1,
        title: "The Square Courtyard Problem",
        difficulty: "Medium",
        description: "A square courtyard has an area of 144 square meters. To find the length of each side, you need to solve the equation x² = 144. What is the length of each side? (Note: Only consider the positive solution since length cannot be negative)",
        answer: "12",
        acceptedAnswers: ["12", "12m", "12 meters", "12 m", "x=12"],
        hints: [
            "To solve x² = 144, take the square root of both sides",
            "Remember that √144 = 12",
            "Since this is a length measurement, we only use the positive value"
        ],
        solution: "Step 1: x² = 144\nStep 2: x = ±√144\nStep 3: x = ±12\nStep 4: Since length must be positive, x = 12 meters",
        premium: false,
        topic: "Quadratic Equations"
    },

    // GEOMETRY BASICS (Group 2)
    {
        id: 6,
        groupId: 2,
        title: "The Classroom Carpet Installation",
        difficulty: "Easy",
        description: "A school is installing new carpet in a rectangular classroom. The room measures 8 cm in length and 5 cm in width on the floor plan. Calculate the total area to determine how much carpet to order.",
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
        title: "The Picture Frame Border",
        difficulty: "Easy",
        description: "An artist is creating a decorative border around a square painting. Each side of the square canvas measures 7 inches. Calculate the total perimeter to determine how much border material is needed to frame all four sides.",
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
        title: "The Sailboat Flag Design",
        difficulty: "Medium",
        description: "A boat designer is creating a triangular flag for a sailboat. The flag has a base of 10 cm and a height of 6 cm. Calculate the area of fabric needed to manufacture this flag design.",
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
        title: "The Bicycle Wheel Measurement",
        difficulty: "Medium",
        description: "A bicycle mechanic needs to order new rubber for a bike wheel. The wheel has a radius of 5 cm. Calculate the circumference to determine the exact length of rubber needed to wrap around the entire wheel. (Use π ≈ 3.14)",
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
        title: "The Storage Container Capacity",
        difficulty: "Medium",
        description: "A warehouse manager is ordering cubic storage containers for inventory. Each container has sides measuring 4 meters. Calculate the volume of each container to determine how much storage capacity it provides.",
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
        title: "The Building Floor Numbers",
        difficulty: "Easy",
        description: "An elevator in an office building stops only at even-numbered floors: 2nd, 4th, 6th, and 8th floors so far. If the pattern continues, which floor will the elevator stop at next?",
        answer: "10",
        acceptedAnswers: ["10", "10th", "10th floor"],
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
        title: "The Family Reunion Age Mystery",
        difficulty: "Medium",
        description: "At a family reunion, Sarah mentions she is 12 years old. Her mother reveals that she is exactly 3 times Sarah's age. Can you determine the mother's current age based on this relationship?",
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
        title: "The Mismatched Locker Numbers",
        difficulty: "Easy",
        description: "A school gym assigns locker numbers in a specific pattern. The assigned lockers are: 2, 4, 7, 8, 10. However, one locker number doesn't follow the same rule as the others. Which number is the odd one out?",
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
        title: "The Rabbit Population Growth Model",
        difficulty: "Hard",
        description: "A biologist is studying rabbit population growth. The monthly population follows this pattern: 1, 1, 2, 3, 5, 8... Each month's population equals the sum of the two previous months. What will the population be in the next month?",
        answer: "13",
        acceptedAnswers: ["13", "13 rabbits"],
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
        title: "The Secret Code Decoder",
        difficulty: "Hard",
        description: "A spy receives a coded message where each letter has a numerical value: A = 1, B = 2, C = 3, and so on. The spy intercepts the code word 'CAB'. What is the total numerical value of this coded message?",
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
        title: "The Farmer's Market Apple Donation",
        difficulty: "Easy",
        description: "Emma runs a fruit stand at the farmer's market with 15 fresh apples. A local charity asks for a donation, and she generously gives 6 apples. How many apples remain in her inventory for customers?",
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
        title: "The Back-to-School Supply Shopping",
        difficulty: "Easy",
        description: "You're shopping for school supplies at the bookstore. Each premium pencil costs $2, and each high-quality eraser costs $1. If you need to buy 3 pencils and 2 erasers, what is your total expense?",
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
        title: "The Highway Road Trip Calculation",
        difficulty: "Medium",
        description: "During a cross-country road trip, your family drives steadily for 2 hours and covers a distance of 120 miles on the highway. Calculate your average travel speed to estimate arrival times for future destinations.",
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
        title: "The Holiday Sale Shopping Strategy",
        difficulty: "Medium",
        description: "You spot a stylish shirt in a department store with an original price tag of $40. The store is having a holiday sale with 25% off all clothing items. Calculate the final sale price to determine if it fits your budget.",
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
        title: "The Construction Project Deadline",
        difficulty: "Hard",
        description: "A construction manager knows that 3 workers can paint a building in 6 hours. Due to a tight deadline, the manager decides to hire 6 workers instead. How many hours will it take the larger team to complete the same painting job?",
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
        title: "The Recipe Scaling Challenge",
        difficulty: "Medium",
        description: "A chef is scaling a recipe for a catering event. The original recipe calls for a certain amount of flour x (in cups), and three halves of this amount (3x/2) equals 9 cups. Solve for x to find the base flour measurement needed.",
        answer: "6",
        acceptedAnswers: ["6", "6.0", "x=6", "6 cups"],
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
        title: "The Ladder Safety Calculation",
        difficulty: "Hard",
        description: "A firefighter places a ladder against a building. The base of the ladder is 3 meters from the wall, and it reaches 4 meters up the building. Using the Pythagorean theorem, calculate the length of the ladder to ensure it meets safety requirements.",
        answer: "5",
        acceptedAnswers: ["5", "5.0", "5 meters"],
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
        title: "The Team Formation Problem",
        difficulty: "Medium",
        description: "A PE teacher wants to divide students into teams of exactly 3 players. There are 20 students numbered 1 through 20. How many student numbers between 1 and 20 are divisible by 3, which would be team captains?",
        answer: "6",
        acceptedAnswers: ["6", "6 students"],
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
        title: "The Semester Grade Calculation",
        difficulty: "Medium",
        description: "A student wants to know their overall performance for the semester. Their test scores across 4 exams are: 85, 90, 78, and 95. Calculate the average score to determine their semester grade and academic standing.",
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
        title: "The Algebraic Pattern Recognition",
        difficulty: "Medium",
        description: "An engineer is simplifying a structural formula that contains the expression x² - 4. To optimize calculations, they need to factor this expression using the difference of squares pattern. What is the factored form?",
        answer: "(x+2)(x-2)",
        acceptedAnswers: [
            "(x+2)(x-2)", "(x-2)(x+2)", "(x + 2)(x - 2)", "(x - 2)(x + 2)",
            "x^2-4=(x+2)(x-2)", "x^2-4=(x-2)(x+2)", "x^2 - 4 = (x + 2)(x - 2)", "x^2 - 4 = (x - 2)(x + 2)"
        ],
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
        title: "The Circular Garden Bed Design",
        difficulty: "Medium",
        description: "A landscape architect is designing a circular flower bed for a park. The flower bed will have a radius of 3 cm on the blueprint. Calculate the area to estimate how much soil and mulch to order. (Use π ≈ 3.14)",
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
        title: "The Cryptography Key Selection",
        difficulty: "Easy",
        description: "A computer security system requires a prime number as an encryption key. From the available options: 15, 17, 18, 20, which number should the system administrator select as it is the only prime number?",
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
        title: "The School Enrollment Planning",
        difficulty: "Hard",
        description: "A school principal is analyzing enrollment data. The current class has a boy-to-girl ratio of 3:2. The registrar confirms there are exactly 15 boys enrolled. Using this ratio, determine how many girls are in the class for resource planning.",
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
        title: "The Temperature Tolerance Problem",
        difficulty: "Hard",
        description: "A laboratory machine must maintain a temperature exactly 5 degrees away from 3°C to function properly. The absolute deviation is represented by |x - 3| = 5. Find both possible temperature settings x that satisfy this requirement.",
        answer: "8,-2",
        acceptedAnswers: ["8,-2", "-2,8", "8 or -2", "-2 or 8", "x=8 or x=-2", "8 and -2"],
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
        title: "The Savings Account Growth Plan",
        difficulty: "Hard",
        description: "You're planning your financial future and decide to invest $1000 in a savings account offering 5% simple interest per year. Calculate how much interest you will earn after 2 years to determine your total savings growth.",
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
