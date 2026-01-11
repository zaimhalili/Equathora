import argparse
import json
import re
from pathlib import Path

# Extracts exercise sets from the OCR'd algebra text (fts.txt by default).
# The OCR contains a table of contents that also has "Exercises" lines; we
# ignore any section that does not include numbered problems like "(1.)".

HEADING_LINE_RE = re.compile(r"^Exercises\s+([IVXLCDM]+)\.\s*$", re.IGNORECASE)
PROBLEM_RE = re.compile(r"\((\d+)\.\)")


def cleanup(text: str) -> str:
    """Normalize whitespace and trim trailing punctuation."""
    lines = [re.sub(r"\s+", " ", ln.strip()) for ln in text.splitlines()]
    flattened = " ".join(filter(None, lines))
    flattened = re.sub(r"\s{2,}", " ", flattened)
    return flattened.strip(" .")


def split_sections_by_lines(raw: str):
    lines = raw.splitlines()
    sections = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        match = HEADING_LINE_RE.match(line)
        if match:
            label = match.group(1)
            start = i + 1
            j = start
            while j < len(lines) and not HEADING_LINE_RE.match(lines[j].strip()):
                j += 1
            sections.append((label, "\n".join(lines[start:j])))
            i = j
        else:
            i += 1
    return sections


def extract_problems(body: str):
    positions = list(PROBLEM_RE.finditer(body))
    problems = []

    if not positions:
        return []

    for idx, match in enumerate(positions):
        start = match.end()
        end = positions[idx + 1].start() if idx + 1 < len(positions) else len(body)
        chunk = cleanup(body[start:end])
        if chunk:
            problems.append(chunk)
    return problems


def run(input_path: Path, out_json: Path, out_txt: Path):
    raw = input_path.read_text(encoding="utf-8", errors="ignore")
    sections = split_sections_by_lines(raw)

    out_json.parent.mkdir(parents=True, exist_ok=True)

    data = []
    lines = []

    for section_label, body in sections:
        problems = extract_problems(body)
        if not problems:
            # Likely a table-of-contents entry; skip.
            continue

        data.append({
            "section": section_label,
            "problems": problems,
            "raw": cleanup(body),
        })
        lines.append(f"Exercises {section_label}")
        lines.extend(f"{idx + 1}. {p}" for idx, p in enumerate(problems))
        lines.append("")

    out_json.write_text(json.dumps(data, indent=2), encoding="utf-8")
    out_txt.write_text("\n".join(lines), encoding="utf-8")

    print(f"Sections found: {len(sections)}")
    print(f"Wrote {out_json}")
    print(f"Wrote {out_txt}")


def main():
    parser = argparse.ArgumentParser(description="Extract exercise sets from OCR text.")
    parser.add_argument("--input", default="fts.txt", help="Path to OCR source text")
    parser.add_argument("--out-json", default="ocr_output/exercises.json", help="Where to write JSON output")
    parser.add_argument("--out-txt", default="ocr_output/exercises.txt", help="Where to write human-readable text output")
    args = parser.parse_args()

    run(Path(args.input), Path(args.out_json), Path(args.out_txt))


if __name__ == "__main__":
    main()
