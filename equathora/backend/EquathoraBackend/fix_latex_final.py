"""
Comprehensive LaTeX Fixer for Equathora Problems - Final Version
Properly converts mathematical expressions to LaTeX format
"""

import re


def convert_to_proper_latex(text):
    """
    Convert plain text mathematical expressions to properly formatted LaTeX.
    
    Strategy:
    1. Wrap parenthetical expressions FIRST as complete units
    2. Identify and wrap complete polynomial sequences (not in parentheses)
    3. Wrap remaining standalone terms
    4. Fix exponent notation with braces
    """
    
    # Remove any existing $ signs first (clean slate)
    text = text.replace('$', '')
    
    result = text
    
    # Step 1: Wrap complete parenthetical expressions that contain variables
    # (2a - 3b + c) becomes $(2a - 3b + c)$
    def wrap_math_parens(match):
        content = match.group(1)
        if re.search(r'[a-zA-Z]', content):
            return f'$({content})$'
        return match.group(0)
    
    result = re.sub(r'\(([^()]+)\)', wrap_math_parens, result)
    
    # Step 2: Identify and wrap complete polynomial sequences
    # Examples: "5x^2 - 7x + 2", "3a - 5b + c", "2x^3 - (...)..." 
    # Pattern: terms connected by + or - operators
    # This regex matches sequences of terms with operators, stopping at sentence boundaries
    
    # Match polynomial-like sequences:  coefficient?variable exponent? [+-] ... up to space/punctuation
    pattern = r'\b(\d*\.?\d*[a-zA-Z]+\^\d+|\d+\.?\d*[a-zA-Z]+|[a-zA-Z]+\^\d+)\s*([-+]\s*(\d*\.?\d*[a-zA-Z]+\^\d+|\d+\.?\d*[a-zA-Z]+|[a-zA-Z]+\^\d+|\d+))+\b'
    
    # Wrap matched polynomial sequences
    result = re.sub(pattern, r'$\g<0>$', result)
    
    # Step 3: Wrap remaining standalone math terms that aren't already wrapped
    parts = result.split('$')
    for i in range(0, len(parts), 2):  # Even indices = unwrapped
        segment = parts[i]
        
        # Wrap: coefficient + variable + exponent (2x^3)
        segment = re.sub(r'\b(\d+\.?\d*[a-zA-Z]+\^\d+)\b', r'$\1$', segment)
        # Wrap: variable + exponent (x^2)
        segment = re.sub(r'\b([a-zA-Z]+\^\d+)\b', r'$\1$', segment)
        # Wrap: coefficient + variable (2x, 3ab)
        segment = re.sub(r'\b(\d+\.?\d*[a-zA-Z]+)\b', r'$\1$', segment)
        
        parts[i] = segment
    
    result = '$'.join(parts)
    
    # Step 4: Merge adjacent $...$ expressions
    for _ in range(20):
        old = result
        # Merge with operators
        result = re.sub(r'\$([^$]+)\$\s*([-+*/=×÷])\s*\$([^$]+)\$', r'$\1 \2 \3$', result)
        # Merge adjacent
        result = re.sub(r'\$([^$]+)\$\s+\$([^$]+)\$', r'$\1 \2$', result)
        if result == old:
            break
    
    # Step 5: Fix exponents to use braces
    def fix_exponents(match):
        content = match.group(1)
        content = re.sub(r'([a-zA-Z0-9])\^(\d+)(?!\})', r'\1^{\2}', content)
        return f'${content}$'
    
    result = re.sub(r'\$([^$]+)\$', fix_exponents, result)
    
    # Step 6: Remove $ from non-math words
    common_words = [
        'Add', 'Compute', 'Take', 'Find', 'Simplify', 'What', 'Where', 'When',
        'from', 'and', 'or', 'the', 'to', 'then', 'than', 'that', 'this', 'these', 'those',
        'result', 'must', 'be', 'been', 'being', 'is', 'are', 'was', 'were',
        'added', 'subtracted', 'multiplied', 'divided',
        'produce', 'leave', 'leaves', 'sum', 'product', 'quotient', 'remainder',
        'expression', 'equation', 'of', 'for', 'in', 'on', 'at', 'with', 'by',
        'it', 'its', 'if', 'so', 'as', 'an', 'a', 'make', 'obtain', 'zero'
    ]
    
    for word in common_words:
        result = result.replace(f' ${word}$ ', f' {word} ')
        result = result.replace(f' ${word.lower()}$ ', f' {word.lower()} ')
        if result.startswith(f'${word}$ '):
            result = f'{word} ' + result[len(f'${word}$ '):]
        if result.startswith(f'${word.lower()}$ '):
            result = f'{word.lower()} ' + result[len(f'${word.lower()}$ '):]
    
    # Remove empty $$
    result = result.replace('$$', '')
    
    # Step 7: Proper spacing
    result = re.sub(r'([a-z])(\$)', r'\1 \2', result)
    result = re.sub(r'(\$)([a-z])', r'\1 \2', result)
    result = re.sub(r'\$([^$]+)([.,;:?!])\$', r'$\1$\2', result)
    result = re.sub(r'\s+', ' ', result)
    result = re.sub(r'\s+([.,;:?!])', r'\1', result)
    
    return result.strip()


def extract_problems_from_seed(filepath):
    """Extract problem data from seed SQL file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    problems = []
    
    # Pattern matches: (id, group_id, 'title', 'difficulty', 'description', ...)
    pattern = r'\(\s*(\d+)\s*,\s*(\d+)\s*,\s*\'([^\']+)\'\s*,\s*\'([^\']+)\'\s*,\s*\'((?:[^\']|\'\')*?)\'\s*,'
    
    for match in re.finditer(pattern, content, re.DOTALL):
        problems.append({
            'id': int(match.group(1)),
            'group_id': int(match.group(2)),
            'title': match.group(3),
            'difficulty': match.group(4),
            'description': match.group(5).replace("''", "'")  # Unescape SQL
        })
    
    return problems


def generate_fix_sql(problems, output_path):
    """Generate SQL file with proper LaTeX formatting."""
    with open(output_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write("-- ================================================================\n")
        f.write("-- FINAL COMPREHENSIVE LATEX FIX FOR ALL PROBLEMS\n")
        f.write("-- Generated by fix_latex_final.py\n")
        f.write("-- This properly wraps ALL mathematical expressions\n")
        f.write("-- Run this in Supabase SQL Editor\n")
        f.write("-- ================================================================\n\n")
        f.write("BEGIN;\n\n")
        
        for prob in problems:
            original = prob['description']
            fixed = convert_to_proper_latex(original)
            
            # Escape single quotes for SQL
            sql_safe = fixed.replace("'", "''")
            
            f.write(f"-- Problem {prob['id']}: {prob['title']}\n")
            if original != fixed:
                f.write(f"-- Original: {original[:75]}...\n")
                f.write(f"-- Fixed:    {fixed[:75]}...\n")
            f.write(f"UPDATE problems SET description = '{sql_safe}' WHERE id = {prob['id']};\n\n")
        
        f.write("COMMIT;\n\n")
        f.write("-- Verification Query:\n")
        f.write("SELECT id, title, LEFT(description, 100) as description FROM problems ORDER BY id;\n")


def main():
    seed_file = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\seed_100_problems.sql"
    output_file = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\fix_latex_final.sql"
    
    print("="*80)
    print("EQUATHORA LATEX FIXER - FINAL VERSION")
    print("="*80)
    print(f"\nReading: {seed_file}")
    
    problems = extract_problems_from_seed(seed_file)
    print(f"✓ Found {len(problems)} problems\n")
    
    if len(problems) == 0:
        print("ERROR: No problems found!")
        return
    
    print("Generating LaTeX fixes...")
    generate_fix_sql(problems, output_file)
    print(f"✓ Generated: {output_file}\n")
    
    # Show examples
    print("="*80)
    print("EXAMPLE CONVERSIONS (First 10 problems):")
    print("="*80 + "\n")
    
    for i, prob in enumerate(problems[:10], 1):
        original = prob['description']
        fixed = convert_to_proper_latex(original)
        
        print(f"{i}. Problem {prob['id']}: {prob['title']}")
        print(f"   Before: {original}")
        print(f"   After:  {fixed}\n")
    
    print("="*80)
    print(f"SUCCESS! All {len(problems)} problems processed.")
    print(f"\nNext step: Run the generated SQL file in Supabase:")
    print(f"  {output_file}")
    print("="*80)


if __name__ == "__main__":
    main()
