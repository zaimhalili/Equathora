import re

in_sql = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\update_latex_descriptions.sql"
out_sql = r"c:\Users\halil\OneDrive - TURKIYE MAARIF VAKFI\Desktop\ITTS 24-25-26\Web Development\Equathora\equathora\backend\EquathoraBackend\repair_latex_descriptions.sql"

# Read file
with open(in_sql, 'r', encoding='utf-8') as f:
    data = f.read()

# Find all UPDATE blocks: capture id and description string
pattern = re.compile(r"UPDATE problems\s+SET description = '((?:[^']|(?:''))*)'\s+WHERE id = (\d+);", re.MULTILINE)

repairs = []

for m in pattern.finditer(data):
    raw_desc = m.group(1).replace("''", "'")
    pid = int(m.group(2))
    desc = raw_desc

    # Fix 1: Merge broken end-of-$ followed by ^ (e.g. $5x$^2 -> $5x^{2}$)
    desc_fixed = re.sub(r"\$([^$]+)\$\s*\^\s*\{?(\w+)\}?", lambda mm: "$" + mm.group(1) + "^{" + mm.group(2) + "}$", desc)

    # Fix 2: Within dollar segments, ensure simple x^2 -> x^{2}
    def brace_inner(mm):
        inner = mm.group(1)
        inner2 = re.sub(r"([A-Za-z0-9])\^(\d+)", r"\1^{\2}", inner)
        return "$" + inner2 + "$"
    desc_fixed = re.sub(r"\$([^$]+)\$", brace_inner, desc_fixed)

    # Fix 3: Cases like 100*0.9^$(n-1)$ -> move caret inside math: 100*0.9^{(n-1)}
    desc_fixed = re.sub(r"(\d+(?:\.\d*)?)\*([A-Za-z0-9_]+)\^\$\(([^)]+)\)\$",
                        lambda m2: f"{m2.group(1)}*{m2.group(2)}^{{({m2.group(3)})}}", desc_fixed)

    # Additional common fix: convert occurrences like $5x$2 (rare) - handled by first fix

    if desc_fixed != desc:
        # Escape single quotes for SQL
        esc = desc_fixed.replace("'", "''")
        repairs.append((pid, esc, desc, desc_fixed))

# Write repair SQL
with open(out_sql, 'w', encoding='utf-8', newline='\n') as f:
    f.write("-- Repair script for LaTeX caret/misplaced-dollar issues\n")
    f.write("BEGIN;\n\n")
    for pid, esc, before, after in repairs:
        f.write(f"-- Fix problem {pid}\n")
        f.write(f"UPDATE problems\nSET description = '{esc}'\nWHERE id = {pid};\n\n")
    f.write("-- Review then COMMIT; or ROLLBACK;\n")
    f.write("COMMIT;\n")

print(f"Generated repair script with {len(repairs)} fixes: {out_sql}")
for pid, esc, before, after in repairs[:10]:
    print(f"ID {pid}: before(60): {before[:60]!r} -> after(60): {after[:60]!r}")
