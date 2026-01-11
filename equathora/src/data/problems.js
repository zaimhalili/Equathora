// Seeded algebra problems derived from OCR of Hall & Knight exercises (polynomial add/sub/construct)
// Structure: { id, groupId, title, difficulty, description, answer, acceptedAnswers, hints, solution, premium, topic }

export const problemGroups = [
  { id: 1, name: "Grade 8 - Add/Subtract Expressions", description: "Combine and simplify linear and binomial expressions" },
  { id: 2, name: "Grade 9 - Polynomial Simplification", description: "Work with higher-degree polynomials and mixed terms" },
  { id: 3, name: "Grade 9 - Expression Reconstruction", description: "Find missing expressions to reach a target form" }
];

export const problems = [
  // Grade 8 - Add/Subtract Expressions (Group 1)
  {
    id: 1,
    groupId: 1,
    title: "Combine Four Linear Triplets",
    difficulty: "Medium",
    description: "Add (2a - 3b - 2c) and (2b - a + 7c) to (a - 4c + 7b) and (c - 6b). Simplify the final sum.",
    answer: "2a+2c",
    acceptedAnswers: ["2a+2c", "2a + 2c", "2c+2a", "2c + 2a"],
    hints: [
      "Combine the first pair, then the second pair.",
      "Sum the intermediate results.",
      "Collect a, b, and c terms separately."
    ],
    solution: "Pair1: (2a - 3b - 2c)+(2b - a + 7c) = a - b + 5c\nPair2: (a - 4c + 7b)+(c - 6b) = a + b - 3c\nTotal: (a - b + 5c)+(a + b - 3c) = 2a + 2c",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 2,
    groupId: 1,
    title: "Cubic Difference then Combine",
    difficulty: "Medium",
    description: "Compute 2x^3 - (5x^3 + 3x - 1) and add the result to (3x^2 + 3x - 1). Simplify.",
    answer: "-3x^3+3x^2",
    acceptedAnswers: ["-3x^3+3x^2", "-3x^3 + 3x^2", "3x^2-3x^3", "3x^2 - 3x^3"],
    hints: [
      "Distribute the minus sign on the subtraction.",
      "Combine the result with 3x^2 + 3x - 1.",
      "Notice the linear terms cancel."
    ],
    solution: "2x^3 - (5x^3 + 3x - 1) = -3x^3 - 3x + 1\nAdd 3x^2 + 3x - 1 gives -3x^3 + 3x^2",
    premium: false,
    topic: "Polynomial Operations"
  },
  {
    id: 3,
    groupId: 1,
    title: "Nested Subtraction with y",
    difficulty: "Medium",
    description: "Add (2y - 3y^2) and (1 - 5y^3) to the remainder of 5y^2 - (1 - 2y^2 + y^3). Simplify.",
    answer: "-6y^3+4y^2+2y",
    acceptedAnswers: ["-6y^3+4y^2+2y", "-6y^3 + 4y^2 + 2y", "4y^2+2y-6y^3", "4y^2 + 2y - 6y^3"],
    hints: [
      "Evaluate the inner subtraction first.",
      "Add the two outside expressions.",
      "Group like powers of y."
    ],
    solution: "5y^2 - (1 - 2y^2 + y^3) = 7y^2 - 1 - y^3\n(2y - 3y^2) + (1 - 5y^3) = -5y^3 - 3y^2 + 2y + 1\nTotal = -6y^3 + 4y^2 + 2y",
    premium: false,
    topic: "Polynomial Operations"
  },
  {
    id: 4,
    groupId: 1,
    title: "Fractional Mix of x and y",
    difficulty: "Hard",
    description: "Take (x^3 - y^3) from (3xy - 4y^2), then add the result to (0.5xy - x^2 - 3y^2) + (2x^2 + 6y^2). Simplify.",
    answer: "-x^3+y^3+x^2+3.5xy-y^2",
    acceptedAnswers: ["-x^3+y^3+x^2+3.5xy-y^2", "-x^3 + y^3 + x^2 + 3.5xy - y^2", "-x^3+y^3+x^2+7/2xy-y^2", "-x^3 + y^3 + x^2 + 7/2xy - y^2"],
    hints: [
      "First compute (3xy - 4y^2) - (x^3 - y^3).",
      "Simplify the second sum separately.",
      "Combine like terms across both results."
    ],
    solution: "(3xy - 4y^2) - (x^3 - y^3) = -x^3 + y^3 + 3xy - 4y^2\n(0.5xy - x^2 - 3y^2) + (2x^2 + 6y^2) = x^2 + 0.5xy + 3y^2\nCombined: -x^3 + y^3 + x^2 + 3.5xy - y^2",
    premium: false,
    topic: "Polynomial Operations"
  },
  {
    id: 5,
    groupId: 1,
    title: "Subtract a Sum from c - 4b",
    difficulty: "Easy",
    description: "Find the sum of (5a - 7b + c) and (3b - 9a), then subtract it from (c - 4b).",
    answer: "4a",
    acceptedAnswers: ["4a"],
    hints: [
      "Add the two three-term expressions first.",
      "Subtract that result from c - 4b.",
      "Only the a-term survives."
    ],
    solution: "(5a - 7b + c) + (3b - 9a) = -4a - 4b + c\n(c - 4b) - (-4a - 4b + c) = 4a",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 6,
    groupId: 1,
    title: "Diminish a Combined Polynomial",
    difficulty: "Medium",
    description: "Add (3x^2 - 7x + 5) to (2x^3 + 5x - 3), then subtract (3x^2 + 2). Simplify.",
    answer: "2x^3-2x",
    acceptedAnswers: ["2x^3-2x", "2x^3 - 2x"],
    hints: [
      "Combine the first two polynomials.",
      "Subtract the third polynomial.",
      "Group like terms."
    ],
    solution: "(3x^2 - 7x + 5)+(2x^3 + 5x - 3) = 2x^3 + 3x^2 - 2x + 2\nSubtract (3x^2 + 2) to get 2x^3 - 2x",
    premium: false,
    topic: "Polynomial Operations"
  },
  {
    id: 7,
    groupId: 1,
    title: "Fill the Gap to Target Quadratic",
    difficulty: "Easy",
    description: "What expression must be added to 5x^2 - 7x + 2 to produce 7x^2 - 1?",
    answer: "2x^2+7x-3",
    acceptedAnswers: ["2x^2+7x-3", "2x^2 + 7x - 3"],
    hints: [
      "Target minus given equals the required addend.",
      "Subtract each coefficient carefully."
    ],
    solution: "(7x^2 - 1) - (5x^2 - 7x + 2) = 2x^2 + 7x - 3",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 8,
    groupId: 1,
    title: "Add to Reach New Cubic Form",
    difficulty: "Medium",
    description: "What expression must be added to 4x^3 - 3x^2 + 2 to produce 4x^3 + 7x - 6?",
    answer: "3x^2+7x-8",
    acceptedAnswers: ["3x^2+7x-8", "3x^2 + 7x - 8"],
    hints: [
      "Subtract the original from the target.",
      "Match coefficients term by term."
    ],
    solution: "(4x^3 + 7x - 6) - (4x^3 - 3x^2 + 2) = 3x^2 + 7x - 8",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 9,
    groupId: 1,
    title: "Required Subtrahend a - b",
    difficulty: "Easy",
    description: "What expression must be subtracted from 3a - 5b + c to leave 2a - 4b + c?",
    answer: "a-b",
    acceptedAnswers: ["a-b", "a - b", "-b+a", "-b + a"],
    hints: [
      "Let S be the subtrahend and solve (3a - 5b + c) - S = 2a - 4b + c.",
      "Subtract componentwise."
    ],
    solution: "S = (3a - 5b + c) - (2a - 4b + c) = a - b",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 10,
    groupId: 1,
    title: "Subtrahend to Hit Target Quadratic",
    difficulty: "Medium",
    description: "What expression must be subtracted from 9x^2 + 11x - 5 to leave 6x^2 - 17x + 3?",
    answer: "3x^2+28x-8",
    acceptedAnswers: ["3x^2+28x-8", "3x^2 + 28x - 8"],
    hints: [
      "Compute original minus target.",
      "Watch the signs on each term."
    ],
    solution: "(9x^2 + 11x - 5) - (6x^2 - 17x + 3) = 3x^2 + 28x - 8",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 11,
    groupId: 1,
    title: "Source Expression for a^2 Terms",
    difficulty: "Hard",
    description: "Find X so that X - (11a^2 - 6ab - 7bc) = 5a^2 + 7ab + 7bc.",
    answer: "16a^2+ab",
    acceptedAnswers: ["16a^2+ab", "16a^2 + ab", "ab+16a^2"],
    hints: [
      "Move the subtracted expression to the right side.",
      "Add term by term."
    ],
    solution: "X = (5a^2 + 7ab + 7bc) + (11a^2 - 6ab - 7bc) = 16a^2 + ab",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 12,
    groupId: 1,
    title: "Source Expression with abc",
    difficulty: "Medium",
    description: "Find X so that X - (3ab + b^2c - 6ca) = 6ca - 5bc.",
    answer: "3ab+b^2c-5bc",
    acceptedAnswers: ["3ab+b^2c-5bc", "3ab + b^2c - 5bc"],
    hints: [
      "Add the subtracted expression to the target remainder.",
      "Combine like bc terms."
    ],
    solution: "X = (6ca - 5bc) + (3ab + b^2c - 6ca) = 3ab + b^2c - 5bc",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 13,
    groupId: 1,
    title: "Add to Complete a Cubic",
    difficulty: "Medium",
    description: "What expression must be added to 7x^3 - 6x^2 - 5x to make 9x^3 - 6x - 7x^2?",
    answer: "2x^3-x^2-x",
    acceptedAnswers: ["2x^3-x^2-x", "2x^3 - x^2 - x"],
    hints: [
      "Take target minus given.",
      "Align coefficients by degree."
    ],
    solution: "(9x^3 - 6x - 7x^2) - (7x^3 - 6x^2 - 5x) = 2x^3 - x^2 - x",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 14,
    groupId: 1,
    title: "Add to Reach Zero",
    difficulty: "Easy",
    description: "What expression must be added to 5ab - 11bc - 7ca to produce zero?",
    answer: "-5ab+11bc+7ca",
    acceptedAnswers: ["-5ab+11bc+7ca", "-5ab + 11bc + 7ca"],
    hints: [
      "You need the additive inverse of each term."
    ],
    solution: "-(5ab - 11bc - 7ca) = -5ab + 11bc + 7ca",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 15,
    groupId: 1,
    title: "Negate a Quadratic",
    difficulty: "Easy",
    description: "If 3x^2 - 7x + 2 is subtracted from zero, what is the result?",
    answer: "-3x^2+7x-2",
    acceptedAnswers: ["-3x^2+7x-2", "-3x^2 + 7x - 2"],
    hints: [
      "Subtracting from zero changes every sign."
    ],
    solution: "0 - (3x^2 - 7x + 2) = -3x^2 + 7x - 2",
    premium: false,
    topic: "Polynomial Operations"
  },
  {
    id: 16,
    groupId: 1,
    title: "Difference of a Sum from 5x^2+3x-1",
    difficulty: "Hard",
    description: "From 5x^2 + 3x - 1 subtract the sum of (2x - 5 + 7x^2) and (3x^3 + 4 - 2x^2 + x). Simplify.",
    answer: "-3x^3",
    acceptedAnswers: ["-3x^3", "-3x^3+0"],
    hints: [
      "Combine the two parentheses first.",
      "Then subtract from 5x^2 + 3x - 1."
    ],
    solution: "(2x - 5 + 7x^2) + (3x^3 + 4 - 2x^2 + x) = 3x^3 + 5x^2 + 3x - 1\n(5x^2 + 3x - 1) - (3x^3 + 5x^2 + 3x - 1) = -3x^3",
    premium: false,
    topic: "Polynomial Operations"
  },
  {
    id: 17,
    groupId: 1,
    title: "Addend for Mixed Cubic",
    difficulty: "Medium",
    description: "Find the expression that must be added to 2x^3 - 3x^2 + x to obtain x^3 + 4x^2 - 5x.",
    answer: "-x^3+7x^2-6x",
    acceptedAnswers: ["-x^3+7x^2-6x", "-x^3 + 7x^2 - 6x"],
    hints: [
      "Compute target minus given.",
      "Track each degree separately."
    ],
    solution: "(x^3 + 4x^2 - 5x) - (2x^3 - 3x^2 + x) = -x^3 + 7x^2 - 6x",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 18,
    groupId: 1,
    title: "Subtract Two Quadratic Forms",
    difficulty: "Medium",
    description: "Simplify (x^2 + 2xy - y^2) - (2x^2 - xy + 3y^2).",
    answer: "-x^2+3xy-4y^2",
    acceptedAnswers: ["-x^2+3xy-4y^2", "-x^2 + 3xy - 4y^2"],
    hints: [
      "Distribute the negative sign to the second parentheses.",
      "Combine like terms."
    ],
    solution: "x^2 + 2xy - y^2 - 2x^2 + xy - 3y^2 = -x^2 + 3xy - 4y^2",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 19,
    groupId: 1,
    title: "Add Two Cubic Binomials",
    difficulty: "Easy",
    description: "Simplify (4a^2b - 2ab^2 + b^3) + (-3a^2b + 5ab^2 - b^3).",
    answer: "a^2b+3ab^2",
    acceptedAnswers: ["a^2b+3ab^2", "a^2b + 3ab^2"],
    hints: [
      "Group the a^2b, ab^2, and b^3 terms separately."
    ],
    solution: "(4a^2b - 2ab^2 + b^3) + (-3a^2b + 5ab^2 - b^3) = a^2b + 3ab^2",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 20,
    groupId: 1,
    title: "Subtract Quadratic in m and n",
    difficulty: "Medium",
    description: "Simplify (6m^2 - 3mn + n^2) - (2m^2 + mn - 4n^2).",
    answer: "4m^2-4mn+5n^2",
    acceptedAnswers: ["4m^2-4mn+5n^2", "4m^2 - 4mn + 5n^2"],
    hints: [
      "Distribute the negative through the second bracket.",
      "Combine like terms."
    ],
    solution: "6m^2 - 3mn + n^2 - 2m^2 - mn + 4n^2 = 4m^2 - 4mn + 5n^2",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 21,
    groupId: 1,
    title: "Three-Step Linear Combination",
    difficulty: "Easy",
    description: "Simplify (5p - 2q) + (7p + 6q) - (4p - 9q).",
    answer: "8p+13q",
    acceptedAnswers: ["8p+13q", "8p + 13q"],
    hints: [
      "Add the first two, then subtract the third.",
      "Combine p-terms and q-terms."
    ],
    solution: "(5p - 2q) + (7p + 6q) = 12p + 4q; subtract (4p - 9q) to get 8p + 13q",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 22,
    groupId: 1,
    title: "rs Mixed Powers",
    difficulty: "Medium",
    description: "Simplify (3r^2s - 5rs^2) - (-2r^2s + 7rs^2).",
    answer: "5r^2s-12rs^2",
    acceptedAnswers: ["5r^2s-12rs^2", "5r^2s - 12rs^2"],
    hints: [
      "Subtracting a negative becomes addition.",
      "Combine the r^2s and rs^2 terms."
    ],
    solution: "3r^2s - 5rs^2 + 2r^2s - 7rs^2 = 5r^2s - 12rs^2",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 23,
    groupId: 1,
    title: "Linear Triple Difference",
    difficulty: "Easy",
    description: "Simplify (9a - 4b + 6c) - (3a + 7b - 2c).",
    answer: "6a-11b+8c",
    acceptedAnswers: ["6a-11b+8c", "6a - 11b + 8c"],
    hints: [
      "Subtract term by term."
    ],
    solution: "(9a - 4b + 6c) - (3a + 7b - 2c) = 6a - 11b + 8c",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 24,
    groupId: 1,
    title: "Add Two Linear Triples",
    difficulty: "Easy",
    description: "Simplify (2x - 3y + 4z) + (-5x + y - z).",
    answer: "-3x-2y+3z",
    acceptedAnswers: ["-3x-2y+3z", "-3x - 2y + 3z"],
    hints: [
      "Combine coefficients of x, y, z separately."
    ],
    solution: "(2x - 3y + 4z) + (-5x + y - z) = -3x - 2y + 3z",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 25,
    groupId: 1,
    title: "Sum of Two Quadratics in u and v",
    difficulty: "Medium",
    description: "Simplify (7u^2 + 2uv - v^2) + (3u^2 - 5uv + 4v^2).",
    answer: "10u^2-3uv+3v^2",
    acceptedAnswers: ["10u^2-3uv+3v^2", "10u^2 - 3uv + 3v^2"],
    hints: [
      "Combine u^2, uv, and v^2 terms separately."
    ],
    solution: "(7u^2 + 2uv - v^2) + (3u^2 - 5uv + 4v^2) = 10u^2 - 3uv + 3v^2",
    premium: false,
    topic: "Polynomial Simplification"
  },

  // Grade 9 - Polynomial Simplification (Group 2)
  {
    id: 26,
    groupId: 2,
    title: "Subtract Two Cubics in x",
    difficulty: "Medium",
    description: "Simplify (6x^3 - 2x^2 + x) - (4x^3 + x^2 - 5x).",
    answer: "2x^3-3x^2+6x",
    acceptedAnswers: ["2x^3-3x^2+6x", "2x^3 - 3x^2 + 6x"],
    hints: [
      "Distribute the subtraction.",
      "Collect like terms."
    ],
    solution: "6x^3 - 2x^2 + x - 4x^3 - x^2 + 5x = 2x^3 - 3x^2 + 6x",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 27,
    groupId: 2,
    title: "Combine Two Quadratics in a and b",
    difficulty: "Easy",
    description: "Simplify (a^2 - 4ab + b^2) + (3ab - 2b^2).",
    answer: "a^2-ab-b^2",
    acceptedAnswers: ["a^2-ab-b^2", "a^2 - ab - b^2"],
    hints: [
      "Combine ab terms then b^2 terms."
    ],
    solution: "a^2 - 4ab + b^2 + 3ab - 2b^2 = a^2 - ab - b^2",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 28,
    groupId: 2,
    title: "Combine with Opposite Signs in xy",
    difficulty: "Medium",
    description: "Simplify (-2x^2y + 5xy^2) - (-3x^2y - xy^2).",
    answer: "x^2y+6xy^2",
    acceptedAnswers: ["x^2y+6xy^2", "x^2y + 6xy^2"],
    hints: [
      "Subtracting a negative flips the sign.",
      "Combine x^2y and xy^2 terms."
    ],
    solution: "-2x^2y + 5xy^2 + 3x^2y + xy^2 = x^2y + 6xy^2",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 29,
    groupId: 2,
    title: "Cubic and Linear Mix in k",
    difficulty: "Easy",
    description: "Simplify (4k^3 - 7k + 2) + (-k^3 + 5k - 9).",
    answer: "3k^3-2k-7",
    acceptedAnswers: ["3k^3-2k-7", "3k^3 - 2k - 7"],
    hints: [
      "Combine k^3 terms, then k terms, then constants."
    ],
    solution: "4k^3 - 7k + 2 - k^3 + 5k - 9 = 3k^3 - 2k - 7",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 30,
    groupId: 2,
    title: "Fractional Coefficients in a and b",
    difficulty: "Medium",
    description: "Simplify (5/2 a - 3/4 b) + (3/2 a + 1/4 b).",
    answer: "4a-0.5b",
    acceptedAnswers: ["4a-0.5b", "4a - 0.5b", "4a-1/2b", "4a - 1/2 b", "4a-1/2 b"],
    hints: [
      "Add the a-terms, then the b-terms.",
      "Convert to halves for clarity."
    ],
    solution: "(5/2 + 3/2)a = 4a; (-3/4 + 1/4)b = -1/2 b",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 31,
    groupId: 2,
    title: "Fractions in x and y",
    difficulty: "Medium",
    description: "Simplify (7/3 x - 5/6 y) - (2/3 x + 1/6 y).",
    answer: "5/3x-y",
    acceptedAnswers: ["5/3x-y", "5/3 x - y", "(5/3)x - y"],
    hints: [
      "Subtract numerators with common denominators.",
      "Combine y-terms carefully."
    ],
    solution: "(7/3 - 2/3)x + (-5/6 - 1/6)y = (5/3)x - y",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 32,
    groupId: 2,
    title: "Decimals in a^2",
    difficulty: "Easy",
    description: "Simplify (0.5a^2 - 3a + 4) + (1.5a^2 + a - 6).",
    answer: "2a^2-2a-2",
    acceptedAnswers: ["2a^2-2a-2", "2a^2 - 2a - 2"],
    hints: [
      "Add a^2 coefficients, then a, then constants."
    ],
    solution: "0.5a^2 + 1.5a^2 = 2a^2; -3a + a = -2a; 4 - 6 = -2",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 33,
    groupId: 2,
    title: "Three-Step Linear in x",
    difficulty: "Easy",
    description: "Simplify (8x - 3) - (2x + 5) + (x - 4).",
    answer: "7x-12",
    acceptedAnswers: ["7x-12", "7x - 12"],
    hints: [
      "Work left to right or combine like terms directly."
    ],
    solution: "8x - 3 - 2x - 5 + x - 4 = 7x - 12",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 34,
    groupId: 2,
    title: "Net Result in m and n",
    difficulty: "Medium",
    description: "Simplify (3m - 2n) - (5m + n) + (2m + 4n).",
    answer: "n",
    acceptedAnswers: ["n"],
    hints: [
      "Combine m-terms and n-terms separately."
    ],
    solution: "3m - 2n - 5m - n + 2m + 4n = n",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 35,
    groupId: 2,
    title: "Subtracting Mixed b^2 Terms",
    difficulty: "Hard",
    description: "Simplify (6a^2b^2 - 4ab^2 + 2b^2) - (3a^2b^2 - 5ab^2 - b^2).",
    answer: "3a^2b^2+ab^2+3b^2",
    acceptedAnswers: ["3a^2b^2+ab^2+3b^2", "3a^2b^2 + ab^2 + 3b^2"],
    hints: [
      "Distribute the negative across the second parentheses.",
      "Combine like b^2 factors."
    ],
    solution: "6a^2b^2 - 4ab^2 + 2b^2 - 3a^2b^2 + 5ab^2 + b^2 = 3a^2b^2 + ab^2 + 3b^2",
    premium: false,
    topic: "Polynomial Simplification"
  },

  // Grade 9 - Expression Reconstruction (Group 3)
  {
    id: 36,
    groupId: 3,
    title: "Addend for a Quadratic Target",
    difficulty: "Medium",
    description: "Find E so that E + (2x^2 - 3x + 1) = 5x^2 + x - 4.",
    answer: "3x^2+4x-5",
    acceptedAnswers: ["3x^2+4x-5", "3x^2 + 4x - 5"],
    hints: [
      "Subtract the known addend from the target."
    ],
    solution: "(5x^2 + x - 4) - (2x^2 - 3x + 1) = 3x^2 + 4x - 5",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 37,
    groupId: 3,
    title: "Subtrahend for a Quadratic Target",
    difficulty: "Medium",
    description: "Find S so that (9y^2 - 2y + 7) - S = 4y^2 + 5y - 1.",
    answer: "5y^2-7y+8",
    acceptedAnswers: ["5y^2-7y+8", "5y^2 - 7y + 8"],
    hints: [
      "Move the target to the left to isolate S."
    ],
    solution: "S = (9y^2 - 2y + 7) - (4y^2 + 5y - 1) = 5y^2 - 7y + 8",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 38,
    groupId: 3,
    title: "Addend to Reach a^2 + 2ab + 3b^2",
    difficulty: "Medium",
    description: "Find the expression that must be added to (-3a^2 + 4ab - b^2) to obtain (a^2 + 2ab + 3b^2).",
    answer: "4a^2-2ab+4b^2",
    acceptedAnswers: ["4a^2-2ab+4b^2", "4a^2 - 2ab + 4b^2"],
    hints: [
      "Compute target minus given."
    ],
    solution: "(a^2 + 2ab + 3b^2) - (-3a^2 + 4ab - b^2) = 4a^2 - 2ab + 4b^2",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 39,
    groupId: 3,
    title: "Subtrahend for Cubic in x",
    difficulty: "Hard",
    description: "Find S so that (7x^3 - x) - S = 2x^3 + 5x.",
    answer: "5x^3-6x",
    acceptedAnswers: ["5x^3-6x", "5x^3 - 6x"],
    hints: [
      "Rearrange to S = (7x^3 - x) - (2x^3 + 5x)."
    ],
    solution: "S = 7x^3 - x - 2x^3 - 5x = 5x^3 - 6x",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 40,
    groupId: 3,
    title: "Addend for pq Mix",
    difficulty: "Medium",
    description: "Find the expression to add to (4p^2q - 3pq^2) to obtain (10p^2q + pq^2).",
    answer: "6p^2q+4pq^2",
    acceptedAnswers: ["6p^2q+4pq^2", "6p^2q + 4pq^2"],
    hints: [
      "Target minus current gives the needed addend."
    ],
    solution: "(10p^2q + pq^2) - (4p^2q - 3pq^2) = 6p^2q + 4pq^2",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 41,
    groupId: 3,
    title: "Subtrahend for Quadratic in m",
    difficulty: "Medium",
    description: "Find the expression that must be subtracted from (8m^2 + 6m - 5) to leave (-m^2 + 2m + 9).",
    answer: "9m^2+4m-14",
    acceptedAnswers: ["9m^2+4m-14", "9m^2 + 4m - 14"],
    hints: [
      "Set S so that original - S = target.",
      "Solve S = original - target."
    ],
    solution: "S = (8m^2 + 6m - 5) - (-m^2 + 2m + 9) = 9m^2 + 4m - 14",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 42,
    groupId: 3,
    title: "Addend for Linear Pair",
    difficulty: "Easy",
    description: "Find the expression to add to (5r - 3s) so the result is (12r + 4s).",
    answer: "7r+7s",
    acceptedAnswers: ["7r+7s", "7r + 7s"],
    hints: [
      "Addend = target - current."
    ],
    solution: "(12r + 4s) - (5r - 3s) = 7r + 7s",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 43,
    groupId: 3,
    title: "Additive Inverse of a Cubic",
    difficulty: "Easy",
    description: "What expression must be added to (2x^3 - x^2 - x) so that the total is zero?",
    answer: "-2x^3+x^2+x",
    acceptedAnswers: ["-2x^3+x^2+x", "-2x^3 + x^2 + x"],
    hints: [
      "Use the additive inverse of each term."
    ],
    solution: "-(2x^3 - x^2 - x) = -2x^3 + x^2 + x",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 44,
    groupId: 3,
    title: "Subtrahend for Linear Triple",
    difficulty: "Medium",
    description: "Find S so that (3a - 2b + c) - S = -a + 4b - c.",
    answer: "4a-6b+2c",
    acceptedAnswers: ["4a-6b+2c", "4a - 6b + 2c"],
    hints: [
      "Solve S = (3a - 2b + c) - (-a + 4b - c)."
    ],
    solution: "S = 3a - 2b + c + a - 4b + c = 4a - 6b + 2c",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 45,
    groupId: 3,
    title: "Addend for Quadratic in k",
    difficulty: "Medium",
    description: "Find S so that (6k^2 - 5k + 2) + S = k^2 + 9k - 7.",
    answer: "-5k^2+14k-9",
    acceptedAnswers: ["-5k^2+14k-9", "-5k^2 + 14k - 9"],
    hints: [
      "Subtract the given from the target."
    ],
    solution: "(k^2 + 9k - 7) - (6k^2 - 5k + 2) = -5k^2 + 14k - 9",
    premium: false,
    topic: "Polynomial Equations"
  },
  {
    id: 46,
    groupId: 3,
    title: "Net of Symmetric Linear Sum",
    difficulty: "Easy",
    description: "Simplify (x + y + z) + (x - y + z) - (2x + 3z).",
    answer: "-z",
    acceptedAnswers: ["-z"],
    hints: [
      "Combine x, y, z separately."
    ],
    solution: "(x + y + z) + (x - y + z) = 2x + 2z; subtract (2x + 3z) to get -z",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 47,
    groupId: 3,
    title: "Subtract a Negative Triple",
    difficulty: "Easy",
    description: "Simplify (4a - 3b + 2c) - (-2a + b - 5c).",
    answer: "6a-4b+7c",
    acceptedAnswers: ["6a-4b+7c", "6a - 4b + 7c"],
    hints: [
      "Subtracting a negative flips signs."
    ],
    solution: "4a - 3b + 2c + 2a - b + 5c = 6a - 4b + 7c",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 48,
    groupId: 3,
    title: "Combine Mixed xy Powers",
    difficulty: "Medium",
    description: "Simplify (5x^2y - 2xy^2 + y^3) + (-3x^2y + 4xy^2 - y^3).",
    answer: "2x^2y+2xy^2",
    acceptedAnswers: ["2x^2y+2xy^2", "2x^2y + 2xy^2"],
    hints: [
      "Group x^2y, xy^2, and y^3 terms."
    ],
    solution: "5x^2y - 2xy^2 + y^3 - 3x^2y + 4xy^2 - y^3 = 2x^2y + 2xy^2",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 49,
    groupId: 3,
    title: "Difference of Two Squares of Binomials",
    difficulty: "Hard",
    description: "Simplify (2a - 3b)^2 - (a - b)^2.",
    answer: "3a^2-10ab+8b^2",
    acceptedAnswers: ["3a^2-10ab+8b^2", "3a^2 - 10ab + 8b^2"],
    hints: [
      "Expand each square separately.",
      "Subtract the second expansion from the first."
    ],
    solution: "(4a^2 - 12ab + 9b^2) - (a^2 - 2ab + b^2) = 3a^2 - 10ab + 8b^2",
    premium: false,
    topic: "Polynomial Simplification"
  },
  {
    id: 50,
    groupId: 3,
    title: "Sum of Two Symmetric Squares",
    difficulty: "Easy",
    description: "Simplify (x - 2)^2 + (x + 2)^2.",
    answer: "2x^2+8",
    acceptedAnswers: ["2x^2+8", "2x^2 + 8"],
    hints: [
      "Expand each square.",
      "Combine like terms."
    ],
    solution: "(x^2 - 4x + 4) + (x^2 + 4x + 4) = 2x^2 + 8",
    premium: false,
    topic: "Polynomial Simplification"
  }
];

export const getProblemsByGroup = (groupId) => problems.filter(p => p.groupId === groupId);
export const getProblemById = (id) => problems.find(p => p.id === id);
export const getGroupById = (id) => problemGroups.find(g => g.id === id);
