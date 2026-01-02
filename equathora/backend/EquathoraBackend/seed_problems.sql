-- Seed problems from problems.js into database
-- Run this AFTER creating the tables

-- Insert problem groups
INSERT INTO
    problem_groups (
        id,
        name,
        description,
        display_order,
        is_active
    )
VALUES (
        1,
        'Algebra Fundamentals',
        'Master basic algebraic equations and expressions',
        1,
        TRUE
    ),
    (
        2,
        'Geometry Basics',
        'Explore shapes, areas, and perimeters',
        2,
        TRUE
    ),
    (
        3,
        'Logic & Puzzles',
        'Develop critical thinking with logic problems',
        3,
        TRUE
    ),
    (
        4,
        'Word Problems',
        'Apply math to real-world scenarios',
        4,
        TRUE
    );

-- Reset sequence for problem_groups
SELECT setval(
        'problem_groups_id_seq', (
            SELECT MAX(id)
            FROM problem_groups
        )
    );

-- Insert first 5 problems as examples (you can add more)
INSERT INTO
    problems (
        id,
        group_id,
        title,
        difficulty,
        description,
        answer,
        accepted_answers,
        hints,
        solution,
        is_premium,
        topic,
        display_order
    )
VALUES (
        1,
        1,
        'The Movie Theater Ticket Pricing',
        'Easy',
        'A movie theater charges $12 for adult tickets and sells popcorn for $5 per bag. Maria spent $29 total buying one adult ticket and some bags of popcorn. Write and solve an equation to find how many bags of popcorn Maria bought. Let p represent the number of popcorn bags.',
        '3.4',
        ARRAY[
            '3.4',
            '3.4 bags',
            '17/5',
            '3 2/5'
        ],
        ARRAY[
            'Set up the equation: 12 + 5p = 29, where p is the number of popcorn bags',
            'Subtract 12 from both sides to isolate the term with p',
            'Then divide both sides by 5 to find the value of p'
        ],
        'Step 1: Set up equation: 12 + 5p = 29
Step 2: Subtract 12 from both sides: 5p = 17
Step 3: Divide by 5: p = 17/5
Step 4: p = 3.4 bags',
        FALSE,
        'Linear Equations',
        1
    ),
    (
        2,
        1,
        'Distributing Resources Fairly',
        'Easy',
        'A teacher has x students in her class. She gives each student 3 pencils and 4 erasers, then keeps 5 extra pencils for herself. Write and simplify an expression for the total number of pencils the teacher started with. Then expand and simplify: 3(x + 4) + 2x - 5',
        '5x+7',
        ARRAY[
            '5x+7',
            '5x + 7',
            '7+5x',
            '7 + 5x'
        ],
        ARRAY[
            'First, distribute the 3 to both terms inside the parentheses: 3x + 12',
            'Then add the 2x term and subtract 5',
            'Combine like terms: 3x + 2x = 5x'
        ],
        'Step 1: 3(x + 4) + 2x - 5
Step 2: 3x + 12 + 2x - 5
Step 3: (3x + 2x) + (12 - 5)
Step 4: 5x + 7',
        FALSE,
        'Algebraic Expressions',
        2
    ),
    (
        3,
        1,
        'The Two Brothers'' Age Mystery',
        'Medium',
        'James is 5 years older than twice his younger brother Tom''s age. If James is currently 23 years old, how old is Tom? Set up the equation where t represents Tom''s age: 2t + 5 = 23, then solve for t.',
        '9',
        ARRAY[
            '9',
            '9 years',
            '9 years old',
            't=9'
        ],
        ARRAY[
            'The equation is 2t + 5 = 23, where t is Tom''s age',
            'Subtract 5 from both sides to get 2t alone',
            'Then divide both sides by 2 to find t'
        ],
        'Step 1: 2t + 5 = 23
Step 2: 2t = 23 - 5
Step 3: 2t = 18
Step 4: t = 18 ÷ 2
Step 5: t = 9 years old',
        FALSE,
        'Linear Equations',
        3
    ),
    (
        4,
        1,
        'Garden Plot Dimensions',
        'Medium',
        'A rectangular garden has a length that is 3 meters more than its width. If we call the width w, we can express the area as w(w + 3). Expand this expression to write the area in standard form. You can also plug in w = 5 to find the specific area for that width (either form is accepted).',
        'w²+3w',
        ARRAY[
            'w²+3w',
            'w^2+3w',
            'w² + 3w',
            'w^2 + 3w',
            '3w+w²',
            '3w+w^2',
            'w(w+3)',
            'w (w+3)',
            '40',
            '40 square meters',
            '40 m^2',
            '40 sqm',
            '40 sq meters'
        ],
        ARRAY[
            'Use the distributive property: w × (w + 3)',
            'Multiply w by each term in the parentheses',
            'w × w = w², and w × 3 = 3w'
        ],
        'Step 1: w(w + 3)
Step 2: w × w + w × 3
Step 3: w² + 3w (expanded form)
Optional check when w = 5: 5² + 3(5) = 25 + 15 = 40 square meters',
        FALSE,
        'Quadratic Expressions',
        4
    ),
    (
        5,
        1,
        'The Square Courtyard Problem',
        'Medium',
        'A square courtyard has an area of 144 square meters. To find the length of each side, you need to solve the equation x² = 144. What is the length of each side? (Note: Only consider the positive solution since length cannot be negative)',
        '12',
        ARRAY[
            '12',
            '12m',
            '12 meters',
            '12 m',
            'x=12'
        ],
        ARRAY[
            'To solve x² = 144, take the square root of both sides',
            'Remember that √144 = 12',
            'Since this is a length measurement, we only use the positive value'
        ],
        'Step 1: x² = 144
Step 2: x = ±√144
Step 3: x = ±12
Step 4: Since length must be positive, x = 12 meters',
        FALSE,
        'Quadratic Equations',
        5
    );

-- Reset sequence for problems
SELECT setval( 'problems_id_seq', ( SELECT MAX(id) FROM problems ) );

-- Note: Add the rest of your problems from problems.js following the same pattern
-- You can do this via:
-- 1. Supabase Table Editor (GUI)
-- 2. SQL Editor (more SQL INSERT statements)
-- 3. Admin panel (build one in your app)