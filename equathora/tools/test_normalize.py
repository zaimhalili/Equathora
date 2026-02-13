"""Quick test: verify normalizeAnswer produces identical output for all input variants of problem 32."""
import re

def normalize_answer(answer: str) -> str:
    if not answer:
        return ""
    s = answer.strip()
    # LaTeX commands
    s = re.sub(r'\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}', r'(\1)/(\2)', s)
    s = re.sub(r'\\[dt]frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}', r'(\1)/(\2)', s)
    s = re.sub(r'\\sqrt\[([^\]]+)\]\{([^{}]+)\}', r'nroot(\2,\1)', s)
    s = re.sub(r'\\sqrt\s*\{([^{}]+)\}', r'sqrt(\1)', s)
    s = re.sub(r'\\cdot|\\times', '*', s)
    s = re.sub(r'\\(left|right|Big|big|Bigg|bigg)', '', s)
    s = re.sub(r'\\([a-zA-Z]+)', r'\1', s)
    s = re.sub(r'[{}]', '', s)
    # General
    s = s.lower()
    s = re.sub(r'\(([^()]+)\)/\(([^()]+)\)', r'\1/\2', s)
    s = s.replace('√', 'sqrt')
    s = s.replace('**', '^')
    # Unicode superscripts
    s = s.replace('²', '^2')
    s = s.replace('³', '^3')
    s = re.sub(r'\s*\+\s*', '+', s)
    s = re.sub(r'\s*-\s*', '-', s)
    s = re.sub(r'\s*\*\s*', '*', s)
    s = re.sub(r'\s*/\s*', '/', s)
    s = re.sub(r'\s*\^\s*', '^', s)
    s = re.sub(r'\s+', '', s)
    s = re.sub(r'[,$°]', '', s)
    s = re.sub(r'\(([a-z0-9]+)\)', r'\1', s)
    return s

# Problem 32 variants
tests = {
    "Stored (LaTeX)":       r"2a^{2}-2a-2",
    "MathLive output":      r"2a^{2}-2a-2",
    "Plain text":           "2a^2-2a-2",
    "Spaced LaTeX":         r"2a^{2} - 2a - 2",
    "User: 2a² - 2a - 2":  "2a²-2a-2",   # Unicode superscript
}

print("=== Problem 32 normalization test ===\n")
results = {}
for label, val in tests.items():
    n = normalize_answer(val)
    results[label] = n
    print(f"  {label:25s} → {n!r}")

unique = set(results.values())
print(f"\nAll match: {len(unique) == 1}  (unique outputs: {unique})")
