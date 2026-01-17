"""
Comprehensive LaTeX Fixer for Equathora Problems
Properly converts mathematical expressions to LaTeX format
"""

import re


def convert_to_proper_latex(text):
    """
    Convert plain text mathematical expressions to properly formatted LaTeX.
    
    Strategy:
    1. Wrap standalone math terms FIRST (2x^3, x^2, 3ab)
    2. Then wrap parenthetical expressions
    3. Merge adjacent math delimiters
    4. Fix exponent notation with braces
    """
    
    # Remove any existing $ signs first (clean slate)
    text = text.replace('$', '')
    
    result = text
    
    # Step 1: Wrap standalone math expressions FIRST
    # This prevents breaking up things like "2x^3"
    
    # 1a. Wrap complete expression with coefficient, variable, and exponent: 2x^3, 0.5xy^2
    result = re.sub(
        r'\b(\d+\.?\d*[a-zA-Z]+\^\d+)\b',
        r'$\1$',
        result
    )
    # 1b. Wrap variable with exponent: x^2, y^3, xy^2
    result = re.sub(
        r'\b([a-zA-Z]+\^\d+)\b',
        r'$\1$',
        result
    )
    # 1c. Wrap coefficient + variable (no exponent): 2x, 3ab, 0.5xy
    result = re.sub(
        r'\b(\d+\.?\d*[a-zA-Z]+)\b',
        r'$\1$',
        result
    )
    
    # Step 2: Wrap parenthetical expressions that contain math/variables
    def wrap_math_parens(match):
        content = match.group(1)
        # Only wrap if it contains variables
        if re.search(r'[a-zA-Z]', content):
            return f'$({content})$'
        return match.group(0)
    
    result = re.sub(r'\(([^()]+)\)', wrap_math_parens, result)
    
    # Step 3: Merge adjacent $...$ with operators between them
    # $2a$ + $3b$ -> $2a + 3b$
    for _ in range(15):  # Multiple passes to handle long expressions
        old = result
        # Merge with arithmetic operators
        result = re.sub(r'\$([^$]+)\$\s*([-+*/=×÷])\s*\$([^$]+)\$', r'$\1 \2 \3$', result)
        # Merge directly adjacent (touching)
        result = re.sub(r'\$([^$]+)\$\$([^$]+)\$', r'$\1 \2$', result)
        # Merge with space but no punctuation between
        result = re.sub(r'\$([^$]+)\$\s+\$([^$]+)\$', r'$\1 \2$', result)
        if result == old:
            break
    
    # Step 4: Fix exponents to use braces
    def fix_exponents_inside(match):
        content = match.group(1)
        # Convert x^2 to x^{2} (but don't touch x^{2} already)
        content = re.sub(r'([a-zA-Z0-9])\^(\d+)(?!\})', r'\1^{\2}', content)
        return f'${content}$'
    
    result = re.sub(r'\$([^$]+)\$', fix_exponents_inside, result)
    
    # Step 5: Clean up - remove $ from around common non-math words
    non_math_words = ['Add', 'Compute', 'Take', 'Find', 'Simplify', 'What', 'from', 'and', 
                      'the', 'to', 'then', 'result', 'must', 'be', 'added', 'subtracted',
                      'produce', 'leave', 'sum', 'remainder', 'expression', 'of', 'for',
                      'or', 'not', 'is', 'are', 'in', 'on', 'at', 'with', 'by']
    
    for word in non_math_words:
        result = result.replace(f' ${word}$ ', f' {word} ')
        result = result.replace(f' ${word.lower()}$ ', f' {word.lower()} ')
        # Also check at beginning/end
        result = result.replace(f'${word}$ ', f'{word} ')
        result = result.replace(f' ${word}$', f' {word}')
    
    # Remove $$ (empty math)
    result = result.replace('$$', '')
    
    # Step 6: Ensure proper spacing around $ delimiters
    # Add space before $ if preceded by a letter (not after another $)
    result = re.sub(r'([a-zA-Z])\$', r'\1 $', result)
    # Add space after $ if followed by a letter (not before another $)
    result = re.sub(r'\$([a-zA-Z])', r'$ \1', result)
    
    # Clean up multiple spaces
    result = re.sub(r'\s+', ' ', result)
    
    # Fix cases where punctuation is inside $
    result = re.sub(r'\$([^$]+)([.,?!])\$', r'$\1$\2', result)
    
    # Clean up space before punctuation
    result = re.sub(r'\s+([.,?!])', r'\1', result)
    
    # Final trim
    result = result.strip()
    
    return result


def extract_problems_from_seed(filepath):
    """Extract problem data from seed SQL file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    problems = []
    
    # Find all problem records in VALUES section
    # Pattern matches: (id, group_id, 'title', 'difficulty', 'description', ...)
    pattern = r'\(\s*(\d+)\s*,\s*(\d+)\s*,\s*\'([^\']+)\'\s*,\s*\'([^\']+)\'\s*,\s*\'((?:[^\']|\'\')*?)\'\s*,'
    
    for match in re.finditer(pattern, content, re.DOTALL):
        problem_id = match.group(1)
        group_id = match.group(2) 
        title = match.group(3)
        difficulty = match.group(4)
        description = match.group(5).replace("''", "'")  # Unescape SQL quotes
        
        problems.append({
            'id': int(problem_id),
            'group_id': int(group_id),
            'title': title,
            'difficulty': difficulty,
            'description': description
        })
    
    return problems


def generate_fix_sql(problems, output_path):
    """Generate SQL file with proper LaTeX formatting."""
    with open(output_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write("-- ================================================================\n")
        f.write("-- COMPREHENSIVE LATEX FIX FOR ALL PROBLEMS\n")
        f.write("-- Generated by fix_latex_properly.py\n")
        f.write("-- Run this in Supabase SQL Editor\n")
        f.write("-- ================================================================\n\n")
        f.write("BEGIN;\n\n")
        
        for prob in problems:
            original = prob['description']
            fixed = convert_to_proper_latex(original)
            
            # Escape single quotes for SQL
            sql_safe = fixed.replace("'", "''")
            
            # Add comment showing the change
            f.write(f"-- Problem {prob['id']}: {prob['title']}\n")
            if original != fixed:
                f.write(f"-- Before: {original[:80]}\n")
                f.write(f"-- After:  {fixed[:80]}\n")
            f.write(f"UPDATE problems\n")
            f.write(f"SET description = '{sql_safe}'\n")
            f.write(f"WHERE id = {prob['id']};\n\n")
        
        f.write("COMMIT;\n\n")
        f.write("-- Verification: Check all descriptions\n")
        f.write("SELECT id, title, LEFT(description, 100) as description\n")
        f.write("FROM problems\n")
        f.write("ORDER BY id;\n")


def main():
    seed_file = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\seed_100_problems.sql"
    output_file = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\fix_latex_final_correct.sql"
    
    print("Reading problems from seed file...")
    problems = extract_problems_from_seed(seed_file)
    print(f"✓ Found {len(problems)} problems")
    
    if len(problems) == 0:
        print("ERROR: No problems found! Check the seed file format.")
        return
    
    print("\nGenerating LaTeX fixes...")
    generate_fix_sql(problems, output_file)
    print(f"✓ Generated {output_file}")
    
    # Show some examples
    print("\n" + "="*80)
    print("EXAMPLE CONVERSIONS (First 5 problems):")
    print("="*80)
    
    for i, prob in enumerate(problems[:5], 1):
        original = prob['description']
        fixed = convert_to_proper_latex(original)
        
        print(f"\n{i}. Problem {prob['id']}: {prob['title']}")
        print(f"   Original: {original}")
        print(f"   Fixed:    {fixed}")
    
    print("\n" + "="*80)
    print(f"✓ All {len(problems)} problems processed successfully!")
    print("✓ Run the generated SQL file in Supabase to apply the fixes.")


if __name__ == "__main__":
    main()
