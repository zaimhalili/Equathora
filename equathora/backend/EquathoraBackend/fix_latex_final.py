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
    
    # Protect escaped dollars and existing math blocks; convert currency to math blocks
    placeholders = []

    def placeholder_token():
        return chr(0xE000 + len(placeholders))

    def protect(match):
        placeholders.append(match.group(0))
        return placeholder_token()

    # Preserve already-escaped dollar signs (e.g., \$50)
    text = re.sub(r'\\\$', protect, text)
    # Preserve existing math blocks ($...$)
    text = re.sub(r'\$[^$]+\$', protect, text)

    # Convert currency dollars like $1,280 or $50 into math blocks with \$
    def convert_currency(match):
        amount = match.group(1)
        placeholders.append(f'$\\${amount}$')
        return placeholder_token()

    text = re.sub(r'\$(\d[\d,]*(?:\.\d+)?)\b', convert_currency, text)
    
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

        # Wrap function-like expressions: h(t), R(p), C(t)
        segment = re.sub(r'\b[a-zA-Z]+\([^()]*\)', r'$\g<0>$', segment)

        # Apply token wrapping on unwrapped subsegments only
        subparts = segment.split('$')
        for j in range(0, len(subparts), 2):
            subsegment = subparts[j]

            num = r'-?\d[\d,]*(?:\.\d+)?'
            token_pattern = (
                r'(?<![\w^])('  # avoid adjacent word chars
                r'\d*\.\d+[a-zA-Z]+\^\d+'         # 0.5x^2
                r'|\d+[a-zA-Z]+\^\d+'              # 2x^3
                r'|[a-zA-Z]+\^\d+'                  # x^2
                r'|\d*\.\d+[a-zA-Z]+'               # 0.5xy
                r'|\d+[a-zA-Z]+'                     # 2x
                r'|' + num + r'/' + num +            # 5/2
                r'|' + num + r'%' +                  # 12%
                r'|' + num +                         # 12, 12.5
                r')'
                r'(?![\w^])'
            )

            def wrap_token(match):
                token = match.group(1)
                if token.endswith('%'):
                    return f'${token[:-1]}\\%$'
                return f'${token}$'

            subsegment = re.sub(token_pattern, wrap_token, subsegment)
            subparts[j] = subsegment

        parts[i] = '$'.join(subparts)
    
    result = '$'.join(parts)
    
    # Step 4: Merge adjacent $...$ expressions
    for _ in range(20):
        old = result
        # Merge with operators
        result = re.sub(r'\$([^$]+)\$\s*([-+*/=^×÷])\s*\$([^$]+)\$', r'$\1 \2 \3$', result)
        # Merge adjacent
        result = re.sub(r'\$([^$]+)\$\s+\$([^$]+)\$', r'$\1 \2$', result)
        if result == old:
            break
    
    # Step 5: Remove $ from non-math words
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
    
    # Step 6: Proper spacing
    result = re.sub(r'\$([^$]+)([.,;:?!])\$', r'$\1$\2', result)
    result = re.sub(r'\s+', ' ', result)
    result = re.sub(r'\s+([.,;:?!])', r'\1', result)
    
    # Restore placeholders (math blocks and escaped/currency dollars)
    for i, original in enumerate(placeholders):
        result = result.replace(chr(0xE000 + i), original)

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
