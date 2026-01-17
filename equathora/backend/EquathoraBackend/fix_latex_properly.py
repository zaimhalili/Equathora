"""
Properly fix LaTeX conversion for all math problems
This script reads the seed file and generates correct LaTeX formatting
"""

import re

def convert_to_latex(text):
    """
    Convert plain text math expressions to proper LaTeX format.
    Identifies mathematical expressions and wraps them appropriately.
    """
    
    result = text
    
    # Strategy: Identify complete mathematical expressions and wrap them
    # We want to avoid breaking up coherent expressions
    
    # Fix 1: Wrap parenthetical expressions containing variables
    # (2a - 3b + c) -> $(2a - 3b + c)$
    def wrap_paren_expr(match):
        content = match.group(1)
        # Check if it contains variables (letters)
        if re.search(r'[a-zA-Z]', content):
            return f'$({content})$'
        return match.group(0)
    
    result = re.sub(r'\(([^()]+)\)', wrap_paren_expr, result)
    
    # Fix 2: Wrap standalone math expressions (not already in $)
    # Examples: 2x^3, 5x^2 - 7x + 3, 3ab + 2bc
    # But NOT if already wrapped
    def wrap_math_expr(match):
        expr = match.group(0)
        # Don't wrap if it's already in $ or part of wrapped content
        return f'${expr}$'
    
    # Match variable expressions with optional coefficients and exponents
    # that are NOT already in dollar signs
    patterns_to_wrap = [
        r'(?<!\$)\b(\d*\.?\d+)?([a-zA-Z]+)(\^?\d*)\b(?!\$)',  # Variables with optional coefficients
    ]
    
    # Fix 3: Merge adjacent dollar-wrapped expressions with operators between
    # $2a$ + $3b$ -> $2a + 3b$
    for _ in range(10):  # Multiple passes
        old_result = result
        # Merge with operators: +, -, *, /, =
        result = re.sub(r'\$([^\$]+)\$\s*([-+*/=])\s*\$([^\$]+)\$', r'$\1 \2 \3$', result)
        # Merge adjacent ones
        result = re.sub(r'\$([^\$]+)\$\s+\$([^\$]+)\$', r'$\1 \2$', result)
        if result == old_result:
            break
    
    # Fix 4: Ensure proper brace notation for exponents inside $
    def fix_exponents(match):
        content = match.group(1)
        # x^2 -> x^{2}, but only if not already braced
        content = re.sub(r'([a-zA-Z])(\^)(\d+)(?!\})', r'\1^{\3}', content)
        return f'${content}$'
    
    result = re.sub(r'\$([^\$]+)\$', fix_exponents, result)
    
    # Fix 5: Clean up any remaining unwrapped math expressions
    # Find sequences like "5x^2" that aren't in $
    def find_and_wrap_remaining(text):
        # Split by $ to identify unwrapped sections
        parts = text.split('$')
        for i in range(0, len(parts), 2):  # Even indices are unwrapped
            # Wrap coefficient+variable patterns
            parts[i] = re.sub(
                r'\b(\d+(?:\.\d+)?)([a-zA-Z]+(?:\^\{?\d+\}?)?)',
                r'$\1\2$',
                parts[i]
            )
            # Wrap exponent patterns not yet wrapped
            parts[i] = re.sub(
                r'\b([a-zA-Z]+)\^(\d+)\b',
                r'$\1^{\2}$',
                parts[i]
            )
        return '$'.join(parts)
    
    result = find_and_wrap_remaining(result)
    
    # Final merge pass
    for _ in range(5):
        old_result = result
        result = re.sub(r'\$([^\$]+)\$\s*([-+*/=])\s*\$([^\$]+)\$', r'$\1 \2 \3$', result)
        result = re.sub(r'\$([^\$]+)\$\s*\$([^\$]+)\$', r'$\1 \2$', result)
        if result == old_result:
            break
    
    return result


def clean_description(desc):
    """Clean up a problem description and apply LaTeX formatting."""
    # Remove any existing malformed LaTeX
    desc = re.sub(r'\$+', ' ', desc)
    
    # Apply conversion
    desc = convert_to_latex(desc)
    
    # Clean up multiple spaces
    desc = re.sub(r'\s+', ' ', desc)
    desc = desc.strip()
    
    return desc


def read_seed_file(filepath):
    """Read and parse the seed_100_problems.sql file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    problems = []
    
    # Find the VALUES section - it spans multiple lines with parenthesized records
    # Pattern: (id, group_id, 'title', 'difficulty', 'description', ...)
    pattern = r'\(\s*(\d+)\s*,\s*(\d+)\s*,\s*\'([^\']+)\'\s*,\s*\'([^\']+)\'\s*,\s*\'((?:[^\']|\'\')*?)\'\s*,'
    
    for match in re.finditer(pattern, content, re.DOTALL):
        problem_id = match.group(1)
        group_id = match.group(2)
        title = match.group(3)
        difficulty = match.group(4)
        description = match.group(5).replace("''", "'")  # SQL escape
        
        problems.append({
            'id': problem_id,
            'group_id': group_id,
            'title': title,
            'difficulty': difficulty,
            'description': description
        })
    
    return problems


def generate_update_sql(problems, output_file):
    """Generate SQL UPDATE statements with proper LaTeX."""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- ============================================\n")
        f.write("-- PROPER LATEX FIX FOR ALL PROBLEMS\n")
        f.write("-- Run this in Supabase SQL Editor\n")
        f.write("-- ============================================\n\n")
        f.write("BEGIN;\n\n")
        
        for prob in problems:
            original_desc = prob['description']
            fixed_desc = clean_description(original_desc)
            
            # Escape single quotes for SQL
            sql_desc = fixed_desc.replace("'", "''")
            
            f.write(f"-- Problem {prob['id']}: {prob['title'][:50]}\n")
            f.write(f"-- Original: {original_desc[:80]}\n")
            f.write(f"-- Fixed: {fixed_desc[:80]}\n")
            f.write(f"UPDATE problems SET description = '{sql_desc}' WHERE id = {prob['id']};\n\n")
        
        f.write("COMMIT;\n")
        f.write("\n-- Verification query:\n")
        f.write("SELECT id, title, LEFT(description, 100) as description FROM problems ORDER BY id;\n")


if __name__ == "__main__":
    seed_file = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\seed_100_problems.sql"
    output_file = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\fix_latex_correct.sql"
    
    print("Reading seed file...")
    problems = read_seed_file(seed_file)
    print(f"Found {len(problems)} problems")
    
    print("Generating SQL updates...")
    generate_update_sql(problems, output_file)
    print(f"Generated {output_file}")
    
    # Show some examples
    print("\nExample conversions:")
    for i, prob in enumerate(problems[:5]):
        original = prob['description']
        fixed = clean_description(original)
        print(f"\n{i+1}. Original: {original[:60]}")
        print(f"   Fixed: {fixed[:60]}")
