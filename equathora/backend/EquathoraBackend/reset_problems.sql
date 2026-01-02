DELETE FROM problems WHERE id > 5;

SELECT setval( 'problems_id_seq', ( SELECT MAX(id) FROM problems ) );

SELECT COUNT(*) as total_problems FROM problems;

SELECT * FROM problems ORDER BY id;