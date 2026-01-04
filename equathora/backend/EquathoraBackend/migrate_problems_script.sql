INSERT INTO
    problem_groups (
        name,
        description,
        display_order,
        is_active
    )
VALUES (
        'Algebra Fundamentals',
        'Basic algebra concepts and equations',
        1,
        TRUE
    ),
    (
        'Geometry Basics',
        'Fundamental geometry principles',
        2,
        TRUE
    ),
    (
        'Number Theory',
        'Properties of numbers and divisibility',
        3,
        TRUE
    ),
    (
        'Logic & Reasoning',
        'Logical thinking and problem solving',
        4,
        TRUE
    )
ON CONFLICT DO NOTHING;

DO $$
DECLARE
    algebra_id INTEGER;
    geometry_id INTEGER;
    number_id INTEGER;
    logic_id INTEGER;
BEGIN
    SELECT id INTO algebra_id FROM problem_groups WHERE name = 'Algebra Fundamentals';
    SELECT id INTO geometry_id FROM problem_groups WHERE name = 'Geometry Basics';
    SELECT id INTO number_id FROM problem_groups WHERE name = 'Number Theory';
    SELECT id INTO logic_id FROM problem_groups WHERE name = 'Logic & Reasoning';

    -- Insert all 30 problems (add your actual problems here)
    -- Example structure - replace with your actual problems from problems.js:
    
    INSERT INTO problems (group_id, title, difficulty, description, answer, accepted_answers, hints, topic, display_order, is_active) VALUES
    (algebra_id, 'Solve for x: 2x + 5 = 15', 'Easy', 'Find the value of x in the linear equation 2x + 5 = 15', '5', ARRAY['5', 'x=5', 'x = 5'], ARRAY['Subtract 5 from both sides', 'Then divide by 2'], 'Linear Equations', 1, TRUE),
    (algebra_id, 'Simplify: 3(x + 4) - 2x', 'Easy', 'Expand and simplify the expression', 'x+12', ARRAY['x+12', 'x + 12', '12+x'], ARRAY['Distribute the 3', 'Combine like terms'], 'Simplification', 2, TRUE),
    (geometry_id, 'Find the area of a circle with radius 5', 'Medium', 'Calculate the area using π ≈ 3.14', '78.5', ARRAY['78.5', '78.54', '25π'], ARRAY['Use formula A = πr²', 'Square the radius first'], 'Circles', 3, TRUE)
    -- Add more problems following this pattern...
    ON CONFLICT DO NOTHING;
    
END $$;

-- Verify insertion
SELECT pg.name AS group_name, COUNT(p.id) AS problem_count
FROM problem_groups pg
    LEFT JOIN problems p ON pg.id = p.group_id
GROUP BY
    pg.name
ORDER BY pg.display_order;