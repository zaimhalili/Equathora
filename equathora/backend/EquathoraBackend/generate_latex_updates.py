"""
Generate SQL UPDATE script to add LaTeX delimiters to problem descriptions.
Safe per-ID explicit updates with proper escaping.
"""
import re

seed_path = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\seed_100_problems.sql"
out_sql = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\update_latex_descriptions.sql"

with open(seed_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def extract_quoted(s):
    """Extract content from SQL single-quoted string (handles doubled quotes)."""
    m = re.search(r"'((?:[^']|(?:''))*)'", s)
    if not m:
        return None
    return m.group(1).replace("''", "'")

def sql_escape(text):
    """Escape single quotes for SQL by doubling them."""
    if text is None:
        return ''
    return text.replace("'", "''")

# Math pattern: parenthetical expressions, exponents, coefficient+variable, variable^power
math_pattern = re.compile(
    r"\([^)]*[A-Za-z0-9\^+\-*/][^)]*\)|"  # parenthetical math like (3x + 2)
    r"[A-Za-z]\^[0-9]+|"  # exponents like x^2
    r"\d+(?:\.\d+)?[A-Za-z]+|"  # coefficients like 2x, 0.5xy
    r"[A-Za-z]+\d+|"  # variable+number like x2
    r"[A-Za-z]\^[A-Za-z0-9]+"  # variable^variable like x^n
)

def auto_wrap(text):
    """Add LaTeX delimiters around math expressions."""
    if text is None:
        return ''
    if '$' in text:  # Already has delimiters
        return text
    
    s = text
    out = ''
    last = 0
    
    for m in math_pattern.finditer(s):
        start, end = m.span()
        token = m.group(0)
        
        # Skip capitalized short words (like "If", "When", "Add")
        if re.fullmatch(r'[A-Z][A-Za-z]{0,2}', token):
            continue
            
        out += s[last:start]
        out += '$' + token + '$'
        last = end
    
    out += s[last:]
    
    # Merge adjacent delimited expressions with operators
    out = re.sub(
        r"\$([^$]+)\$\s*([+\-*/=,;\s]+)\s*\$([^$]+)\$",
        lambda m: '$' + m.group(1).strip() + ' ' + m.group(2).strip() + ' ' + m.group(3).strip() + '$',
        out
    )
    
    # Convert exponents to braced format inside delimiters
    def brace_exponents(m):
        inner = m.group(1)
        inner = re.sub(r"([A-Za-z0-9])\^(\d+)", r"\1^{\2}", inner)
        return '$' + inner + '$'
    
    out = re.sub(r"\$([^$]+)\$", brace_exponents, out)
    
    return out

# Parse problems from seed file
entries = []
for i, line in enumerate(lines):
    m = re.match(r"^\s*(\d+),\s*$", line)
    if not m:
        continue
    
    try:
        pid = int(m.group(1))
        
        # Problem structure: id, group_id, title, difficulty, description, ...
        group_line = lines[i + 1]
        title_line = lines[i + 2]
        difficulty_line = lines[i + 3]
        desc_line = lines[i + 4]
        
        # Filter: only process lines with valid difficulty
        diff = extract_quoted(difficulty_line)
        if diff not in ('Easy', 'Medium', 'Hard'):
            continue
        
        title = extract_quoted(title_line)
        desc = extract_quoted(desc_line)
        
        if desc:  # Only process non-empty descriptions
            wrapped = auto_wrap(desc)
            
            # Only include if wrapping changed something
            if wrapped != desc:
                entries.append({
                    'id': pid,
                    'title': title,
                    'original': desc,
                    'wrapped': wrapped
                })
    except Exception as e:
        continue

# Generate SQL update script
sql_lines = [
    "-- ================================================================",
    "-- LaTeX Description Updates for Equathora Problems",
    "-- ================================================================",
    "-- IMPORTANT: Create a backup before running!",
    "--   pg_dump -Fc -f problems_backup.sqlc -h <host> -U <user> <dbname>",
    "--   OR use Supabase dashboard to export data",
    "--",
    "-- This script adds LaTeX delimiters ($...$) to problem descriptions",
    "-- containing mathematical expressions.",
    "--",
    f"-- Total problems to update: {len(entries)}",
    "-- ================================================================",
    "",
    "-- Optional: Preserve originals (run once before updates)",
    "-- ALTER TABLE problems ADD COLUMN IF NOT EXISTS original_description text;",
    "-- UPDATE problems SET original_description = description WHERE original_description IS NULL;",
    "",
    "-- Start transaction (allows rollback if needed)",
    "BEGIN;",
    "",
    "-- ================================================================",
    "-- Per-ID Updates (Safe & Reviewable)",
    "-- ================================================================",
    ""
]

for entry in entries:
    pid = entry['id']
    escaped_desc = sql_escape(entry['wrapped'])
    
    sql_lines.extend([
        f"-- Problem {pid}: {entry['title'][:60]}...",
        f"UPDATE problems",
        f"SET description = '{escaped_desc}'",
        f"WHERE id = {pid};",
        ""
    ])

sql_lines.extend([
    "-- ================================================================",
    "-- Commit or Rollback",
    "-- ================================================================",
    "-- Review changes above, then choose:",
    "-- COMMIT;    -- To apply changes permanently",
    "-- ROLLBACK;  -- To undo all changes",
    "",
    "-- Auto-commit (comment out if you want to review first):",
    "COMMIT;",
    ""
])

# Write SQL file
with open(out_sql, 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(sql_lines))

print(f"Generated SQL update script: {out_sql}")
print(f"Total updates: {len(entries)}")
print("\nFirst 5 updates:")
for entry in entries[:5]:
    print(f"  ID {entry['id']}: {entry['title']}")
    print(f"    Original: {entry['original'][:80]}...")
    print(f"    Wrapped:  {entry['wrapped'][:80]}...")
