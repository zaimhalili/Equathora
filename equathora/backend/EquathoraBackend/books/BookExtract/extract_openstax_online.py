#!/usr/bin/env python3
# pyright: reportMissingImports=false
"""
Scrape exercises and example problems from OpenStax online textbook pages.

Usage examples:
    python extract_openstax_online.py
    python extract_openstax_online.py --book-url https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-introduction
    python extract_openstax_online.py --book-url URL1 --book-url URL2 --output problems.json

Prerequisites:
    pip install playwright
    python -m playwright install
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import random
import re
import statistics
import time
import unicodedata
from dataclasses import dataclass
from typing import Any
import urllib.request
from urllib.parse import urldefrag, urlparse
import xml.etree.ElementTree as ET

from playwright.async_api import Browser, Page, async_playwright


# You can set default OpenStax book URLs here.
BOOK_URLS: list[str] = [
    "https://openstax.org/books/algebra-and-trigonometry-2e",
    "https://openstax.org/books/calculus-volume-1",
    "https://openstax.org/books/calculus-volume-2",
    "https://openstax.org/books/calculus-volume-3",
    "https://openstax.org/books/college-algebra-2e",
    "https://openstax.org/books/contemporary-mathematics",
    "https://openstax.org/books/intermediate-algebra-2e",
    "https://openstax.org/books/precalculus-2e",
    "https://openstax.org/books/statistics",
    "https://openstax.org/books/introductory-statistics-2e",
]

OUTPUT_DIR = "openstax_problems"
PAGE_DELAY_SECONDS = (0.8, 1.6)
NAVIGATION_TIMEOUT_MS = 45000


@dataclass
class SectionLink:
    url: str
    chapter: str
    section: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Scrape OpenStax exercises/examples with MathJax-first LaTeX extraction."
        )
    )
    parser.add_argument(
        "--book-url",
        action="append",
        default=[],
        help="OpenStax main book URL. Use multiple --book-url options for many books.",
    )
    parser.add_argument(
        "--output-dir",
        default=OUTPUT_DIR,
        help=(
            "Output folder where each book is saved as a separate JSON file "
            "(default: openstax_problems)."
        ),
    )
    parser.add_argument(
        "--combined-output",
        default="",
        help="Optional combined JSON file path containing all books.",
    )
    parser.add_argument(
        "--headful",
        action="store_true",
        help="Run browser in headful mode for debugging.",
    )
    parser.add_argument(
        "--max-sections-per-book",
        type=int,
        default=0,
        help="Optional limit for sections per book (0 = no limit).",
    )
    parser.add_argument(
        "--audit",
        action="store_true",
        help="Audit output folder after extraction and print quality stats.",
    )
    parser.add_argument(
        "--audit-only",
        action="store_true",
        help="Skip extraction and audit an existing output folder.",
    )
    parser.add_argument(
        "--audit-report",
        default="",
        help="Optional path to write audit report JSON.",
    )
    return parser.parse_args()


def build_book_urls(args: argparse.Namespace) -> list[str]:
    seen: set[str] = set()
    urls: list[str] = []
    sources = args.book_url if args.book_url else BOOK_URLS
    for raw in sources:
        if not raw:
            continue
        clean, _ = urldefrag(raw.strip())
        if clean and clean not in seen:
            seen.add(clean)
            urls.append(clean)
    return urls


def normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def collapse_duplicated_token_halves(text: str) -> str:
    parts = text.split(" ")
    if len(parts) >= 10 and len(parts) % 2 == 0:
        half = len(parts) // 2
        if parts[:half] == parts[half:]:
            return " ".join(parts[:half]).strip()
    return text


def clean_question_text(text: str) -> str:
    text = unicodedata.normalize("NFKC", text or "")
    text = normalize_whitespace(text)
    if not text:
        return ""

    text = text.replace("⁢", " ").replace("⁡", " ")
    text = text.replace("\u2062", " ").replace("\u2061", " ")
    text = re.sub(r"\s+", " ", text).strip()
    text = collapse_duplicated_token_halves(text)
    text = re.sub(r"\s+([,.;:!?])", r"\1", text)
    text = re.sub(r"\(\s+", "(", text)
    text = re.sub(r"\s+\)", ")", text)
    text = re.sub(r"(?:\[MATH\]\s*){2,}", "[MATH] ", text)

    # Remove immediately repeated token sequences (common in OpenStax rendered text).
    toks = text.split(" ")
    i = 0
    while i < len(toks):
        removed = False
        max_len = min(40, (len(toks) - i) // 2)
        for seq_len in range(max_len, 7, -1):
            if toks[i : i + seq_len] == toks[i + seq_len : i + (2 * seq_len)]:
                del toks[i + seq_len : i + (2 * seq_len)]
                removed = True
                break
        if not removed:
            i += 1

    text = " ".join(toks)
    return text.strip()


def normalize_latex(expr: str) -> str:
    expr = (expr or "").strip()
    expr = re.sub(r"^\$+|\$+$", "", expr).strip()
    expr = re.sub(r"^\\\(|\\\)$", "", expr).strip()
    expr = re.sub(r"^\\\[|\\\]$", "", expr).strip()
    expr = expr.replace("−", "-")
    expr = re.sub(r"\s+", " ", expr)
    expr = expr.replace("{ ", "{").replace(" }", "}")
    expr = expr.strip()

    # Repair frequent minor formatting artifacts.
    expr = expr.replace("\\left ", "\\left").replace("\\right ", "\\right")
    expr = expr.replace("\\,", " ")
    expr = expr.replace("⁢", " ")
    expr = expr.replace("⁡", " ")
    expr = expr.replace("\u2062", " ")
    expr = expr.replace("\u2061", " ")
    expr = re.sub(r"\s+", " ", expr).strip()

    # Collapse common repeated pattern: "A A".
    parts = expr.split(" ")
    if len(parts) >= 6 and len(parts) % 2 == 0:
        half = len(parts) // 2
        if parts[:half] == parts[half:]:
            expr = " ".join(parts[:half]).strip()

    return expr


def balanced_pairs(text: str, open_char: str, close_char: str) -> bool:
    balance = 0
    for ch in text:
        if ch == open_char:
            balance += 1
        elif ch == close_char:
            balance -= 1
            if balance < 0:
                return False
    return balance == 0


def is_valid_latex(expr: str) -> bool:
    if not expr:
        return False
    if "<" in expr or ">" in expr or "mjx-" in expr:
        return False
    if not balanced_pairs(expr, "{", "}"):
        return False
    if not balanced_pairs(expr, "(", ")"):
        return False
    if "\\begin" in expr and "\\end" not in expr:
        return False
    if "\\end" in expr and "\\begin" not in expr:
        return False
    # Must contain at least one math-like token.
    if not re.search(r"[\\^_=]|\d|[a-zA-Z]", expr):
        return False
    if len(expr) < 2:
        return False
    return True


def remove_xml_namespace(tag: str) -> str:
    return tag.split("}", 1)[-1] if "}" in tag else tag


def mathml_to_latex(mathml: str) -> str:
    """Best-effort MathML to LaTeX conversion for common textbook expressions."""

    def render(node: ET.Element) -> str:
        tag = remove_xml_namespace(node.tag)
        children = list(node)
        text = (node.text or "").strip()

        if tag in {"math", "mrow"}:
            return " ".join(filter(None, (render(child) for child in children))).strip()

        if tag == "mi":
            return text
        if tag == "mn":
            return text
        if tag == "mo":
            ops = {
                "×": r"\\times",
                "·": r"\\cdot",
                "−": "-",
                "≤": r"\\le",
                "≥": r"\\ge",
                "≠": r"\\ne",
                "±": r"\\pm",
                "∓": r"\\mp",
                "∞": r"\\infty",
                "∈": r"\\in",
                "∉": r"\\notin",
                "∪": r"\\cup",
                "∩": r"\\cap",
                "→": r"\\to",
                "⇒": r"\\Rightarrow",
                "≈": r"\\approx",
            }
            return ops.get(text, text)

        if tag == "msup" and len(children) >= 2:
            return f"{render(children[0])}^{{{render(children[1])}}}"

        if tag == "msub" and len(children) >= 2:
            return f"{render(children[0])}_{{{render(children[1])}}}"

        if tag == "msubsup" and len(children) >= 3:
            base = render(children[0])
            sub = render(children[1])
            sup = render(children[2])
            return f"{base}_{{{sub}}}^{{{sup}}}"

        if tag == "mfrac" and len(children) >= 2:
            return f"\\frac{{{render(children[0])}}}{{{render(children[1])}}}"

        if tag == "msqrt" and children:
            inner = " ".join(filter(None, (render(child) for child in children)))
            return f"\\sqrt{{{inner}}}"

        if tag == "mroot" and len(children) >= 2:
            radicand = render(children[0])
            degree = render(children[1])
            return f"\\sqrt[{degree}]{{{radicand}}}"

        if tag == "mfenced":
            open_ch = node.attrib.get("open", "(")
            close_ch = node.attrib.get("close", ")")
            sep = node.attrib.get("separators", ",")
            rendered_children = [render(child) for child in children if render(child)]
            inner = f" {sep} ".join(rendered_children)
            return f"{open_ch}{inner}{close_ch}"

        if tag == "mtext":
            return text

        if tag == "mtable":
            rows: list[str] = []
            for row in children:
                if remove_xml_namespace(row.tag) != "mtr":
                    continue
                cols: list[str] = []
                for cell in list(row):
                    if remove_xml_namespace(cell.tag) == "mtd":
                        cols.append(" ".join(render(c) for c in list(cell)).strip())
                rows.append(" & ".join(cols))
            if not rows:
                return ""
            return "\\begin{bmatrix} " + r" \\ ".join(rows) + " \\end{bmatrix}"

        if children:
            return " ".join(filter(None, (render(child) for child in children))).strip()

        return text

    if not mathml or "<math" not in mathml:
        return ""

    try:
        root = ET.fromstring(mathml)
    except ET.ParseError:
        return ""

    return normalize_latex(render(root))


def build_question_text(visible_text: str, latex_expressions: list[str]) -> str:
    clean = clean_question_text(visible_text)
    if not clean:
        return ""

    if "[MATH]" in clean and latex_expressions:
        out = clean
        for expr in latex_expressions:
            out = out.replace("[MATH]", f"\\({expr}\\)", 1)
        out = out.replace("[MATH]", "")
        out = normalize_whitespace(out)
        return out

    if len(clean) < 30 and latex_expressions:
        inline = " ".join(f"\\({x}\\)" for x in latex_expressions[:3])
        return normalize_whitespace(f"{clean} {inline}")

    return clean


def parse_section_from_url(url: str) -> tuple[str, str]:
    parsed = urlparse(url)
    parts = [p for p in parsed.path.split("/") if p]
    section_slug = ""
    if "pages" in parts:
        idx = parts.index("pages")
        if idx + 1 < len(parts):
            section_slug = parts[idx + 1]

    section = section_slug.replace("-", " ").strip() or "Unknown Section"

    chapter = "Unknown Chapter"
    match = re.match(r"(\d+)", section_slug)
    if match:
        chapter = f"Chapter {match.group(1)}"

    return chapter, section


def strip_html_tags(text: str) -> str:
    text = text or ""
    text = re.sub(r"<[^>]+>", " ", text)
    return normalize_whitespace(text)


def extract_chapter_label(title: str) -> str:
    clean = strip_html_tags(title)
    match = re.match(r"(\d+)\b", clean)
    if match:
        return f"Chapter {match.group(1)}"
    return ""


def parse_links_from_archive_json(archive_json_url: str, book_url: str) -> list[SectionLink]:
    try:
        raw = urllib.request.urlopen(archive_json_url, timeout=40).read().decode("utf-8")
        payload = json.loads(raw)
    except Exception:
        return []

    tree = payload.get("tree") if isinstance(payload, dict) else None
    if not isinstance(tree, dict):
        return []

    book_slug = extract_book_slug(book_url)
    host = f"{urlparse(book_url).scheme}://{urlparse(book_url).netloc}"
    links: list[SectionLink] = []

    def walk(node: dict[str, Any], chapter_hint: str) -> None:
        title = node.get("title", "")
        local_chapter = chapter_hint or extract_chapter_label(title)
        slug = str(node.get("slug") or "").strip()
        contents = node.get("contents") or []

        is_leaf = isinstance(contents, list) and len(contents) == 0
        if is_leaf and slug:
            section = strip_html_tags(title) or slug.replace("-", " ")
            chapter = local_chapter or "Unknown Chapter"
            page_url = f"{host}/books/{book_slug}/pages/{slug}"
            links.append(SectionLink(url=page_url, chapter=chapter, section=section))
            return

        if isinstance(contents, list):
            for child in contents:
                if isinstance(child, dict):
                    walk(child, local_chapter)

    walk(tree, "")

    dedup: list[SectionLink] = []
    seen: set[str] = set()
    for link in links:
        href, _ = urldefrag(link.url)
        if href in seen:
            continue
        seen.add(href)
        dedup.append(link)

    return dedup


async def wait_for_ready(page: Page) -> None:
    await page.wait_for_load_state("domcontentloaded", timeout=NAVIGATION_TIMEOUT_MS)
    await page.wait_for_load_state("networkidle", timeout=NAVIGATION_TIMEOUT_MS)

    # Wait for MathJax startup if it exists.
    try:
        await page.wait_for_function(
            "() => !window.MathJax || (window.MathJax && window.MathJax.startup)",
            timeout=12000,
        )
        await page.evaluate(
            """
            async () => {
              if (!window.MathJax) return;
              if (window.MathJax.startup && window.MathJax.startup.promise) {
                await window.MathJax.startup.promise;
              }
              if (typeof window.MathJax.typesetPromise === 'function') {
                await window.MathJax.typesetPromise();
              }
            }
            """
        )
    except Exception:
        # Some pages may not use MathJax or may block runtime access.
        pass


async def discover_section_links(page: Page, book_url: str) -> list[SectionLink]:
    archive_json_url: str = ""

    def on_request(req: Any) -> None:
        nonlocal archive_json_url
        url = req.url
        if archive_json_url:
            return
        if "/apps/archive/" in url and "/contents/" in url and url.endswith(".json"):
            archive_json_url = url

    page.on("request", on_request)

    await page.goto(book_url, wait_until="domcontentloaded", timeout=NAVIGATION_TIMEOUT_MS)
    await wait_for_ready(page)

    if archive_json_url:
        archive_links = parse_links_from_archive_json(archive_json_url, book_url)
        if archive_links:
            return archive_links

    raw_links: list[dict[str, Any]] = await page.evaluate(
        """
        () => {
          const anchors = Array.from(document.querySelectorAll('a[href]'));
          const rows = [];

          for (const a of anchors) {
            const href = a.getAttribute('href');
            if (!href) continue;
            if (!href.includes('/pages/')) continue;
            if (href.startsWith('#')) continue;

            const abs = new URL(href, window.location.href).href;
            const text = (a.textContent || '').trim();

            let chapter = '';
            const chapterNode = a.closest('[class*="chapter"], section, article, li, div');
            if (chapterNode) {
              const heading = chapterNode.querySelector('h1, h2, h3, h4, .os-title, .title');
              chapter = heading ? (heading.textContent || '').trim() : '';
            }

            rows.push({ url: abs, sectionText: text, chapterText: chapter });
          }

          return rows;
        }
        """
    )

    seen: set[str] = set()
    links: list[SectionLink] = []
    book_host = urlparse(book_url).netloc.lower()

    for item in raw_links:
        href, _ = urldefrag(item.get("url", ""))
        if not href:
            continue

        parsed = urlparse(href)
        if parsed.netloc.lower() != book_host:
            continue
        if "/books/" not in parsed.path or "/pages/" not in parsed.path:
            continue
        if href in seen:
            continue

        seen.add(href)
        guessed_chapter, guessed_section = parse_section_from_url(href)
        chapter = normalize_whitespace(item.get("chapterText", "")) or guessed_chapter
        section = normalize_whitespace(item.get("sectionText", "")) or guessed_section

        links.append(SectionLink(url=href, chapter=chapter, section=section))

    # Some OpenStax book landing URLs redirect to a single intro page and expose
    # very few /pages/ links. In that case, crawl via "next" links to discover
    # the full page chain.
    if len(links) < 5:
        fallback_links = await discover_section_links_via_next(page, page.url)
        if len(fallback_links) > len(links):
            return fallback_links

    return links


async def discover_section_links_via_next(
    page: Page, start_url: str, max_pages: int = 1200
) -> list[SectionLink]:
    current_url, _ = urldefrag(start_url)
    visited: set[str] = set()
    discovered: list[SectionLink] = []

    while current_url and current_url not in visited and len(discovered) < max_pages:
        visited.add(current_url)
        await page.goto(current_url, wait_until="domcontentloaded", timeout=NAVIGATION_TIMEOUT_MS)
        await wait_for_ready(page)

        page_url, _ = urldefrag(page.url)
        chapter_guess, section_guess = parse_section_from_url(page_url)
        heading = normalize_whitespace(
            await page.evaluate(
                """
                () => {
                  const h = document.querySelector('h1, h2, h3, .os-title, .title');
                  return h ? (h.textContent || '') : '';
                }
                """
            )
        )

        if "/pages/" in urlparse(page_url).path:
            discovered.append(
                SectionLink(
                    url=page_url,
                    chapter=chapter_guess,
                    section=heading or section_guess,
                )
            )

        next_url: str = await page.evaluate(
            """
            () => {
              const anchors = Array.from(document.querySelectorAll('a[href]'));
              const pick = (a) => new URL(a.getAttribute('href'), window.location.href).href;

              for (const a of anchors) {
                const rel = (a.getAttribute('rel') || '').toLowerCase();
                if (rel.includes('next')) return pick(a);
              }

              for (const a of anchors) {
                const txt = (a.textContent || '').trim().toLowerCase();
                const cls = (a.className || '').toString().toLowerCase();
                const aria = (a.getAttribute('aria-label') || '').toLowerCase();
                if (txt === 'next' || txt.startsWith('next ') || cls.includes('next') || aria.includes('next')) {
                  return pick(a);
                }
              }

              return '';
            }
            """
        )

        next_url, _ = urldefrag(next_url or "")
        parsed = urlparse(next_url) if next_url else None
        if not next_url or not parsed:
            break
        if "/books/" not in parsed.path or "/pages/" not in parsed.path:
            break
        if next_url in visited:
            break

        current_url = next_url
        await asyncio.sleep(random.uniform(*PAGE_DELAY_SECONDS))

    return discovered


async def extract_raw_problems(page: Page) -> list[dict[str, Any]]:
    return await page.evaluate(
        """
        () => {
                    const unique = new Set();
                    const elements = [];
                    const selectors = [
                        '[data-type="problem"]',
                        '[data-type="exercise"]',
                        '[data-type="example"]'
                    ];

                    const allCandidates = [];
                    for (const sel of selectors) {
                        for (const node of document.querySelectorAll(sel)) {
                            allCandidates.push(node);
                        }
                    }

                    for (const node of allCandidates) {
                        // Keep leaf-level problem nodes; skip wrappers containing other candidates.
                        const childCandidate = node.querySelector('[data-type="problem"], [data-type="exercise"], [data-type="example"]');
                        if (childCandidate) continue;

                        const clone = node.cloneNode(true);
                        for (const rm of clone.querySelectorAll('script,style,noscript,mjx-assistive-mml,.MJX_Assistive_MathML,.MathJax_Preview,.sr-only,.visually-hidden,[class*="screen-reader"]')) {
                            rm.remove();
                        }

                        for (const mathNode of clone.querySelectorAll('math,mjx-container,.MathJax,.mjx-chtml,.katex')) {
                            mathNode.replaceWith(document.createTextNode(' [MATH] '));
                        }

                        const text = ((clone.innerText || clone.textContent || '')).replace(/\\s+/g, ' ').trim();
                        if (!text) continue;
                        if (text.length < 15) continue;

                        if (!unique.has(node)) {
                            unique.add(node);
                            elements.push(node);
                        }
                    }

          const out = [];

          for (const el of elements) {
                        const dt = ((el.getAttribute('data-type') || '') + ' ' + (el.className || '')).toLowerCase();
                        const type = dt.includes('example') ? 'example' : 'exercise';

            const text = (el.innerText || '').replace(/\\s+/g, ' ').trim();

            let latex = [];
            if (window.MathJax && window.MathJax.startup && window.MathJax.startup.document && typeof window.MathJax.startup.document.getMathItemsWithin === 'function') {
              try {
                const mathItems = window.MathJax.startup.document.getMathItemsWithin(el) || [];
                for (const item of mathItems) {
                  const src = (item.math || item.latex || item.tex || '').toString().trim();
                  if (src) latex.push(src);
                }
              } catch (_) {}
            }

            // Fallback source: raw MathML snippets.
            const mathml = [];
            for (const m of el.querySelectorAll('math')) {
              const raw = (m.outerHTML || '').trim();
              if (raw) mathml.push(raw);
            }

            out.push({ type, text, latex, mathml });
          }

          return out;
        }
        """
    )


def extract_book_slug(book_url: str) -> str:
    parsed = urlparse(book_url)
    parts = [p for p in parsed.path.split("/") if p]
    if "books" in parts:
        idx = parts.index("books")
        if idx + 1 < len(parts):
            return parts[idx + 1]
    return parsed.netloc


def slug_to_filename(slug: str) -> str:
    safe = re.sub(r"[^a-zA-Z0-9._-]+", "_", slug).strip("._")
    return safe or "book"


def write_json(file_path: str, payload: Any) -> None:
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def audit_output_dir(output_dir: str, report_path: str = "") -> dict[str, Any]:
    files = sorted(
        [
            os.path.join(output_dir, x)
            for x in os.listdir(output_dir)
            if x.endswith(".json") and x != "manifest.json"
        ]
    )

    rows: list[tuple[str, list[dict[str, Any]]]] = []
    bad_json_files: list[dict[str, str]] = []

    for path in files:
        name = os.path.basename(path)
        try:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
            if not isinstance(data, list):
                bad_json_files.append({"file": name, "error": "non-list json"})
                continue
            typed = [x for x in data if isinstance(x, dict)]
            rows.append((name, typed))
        except Exception as exc:
            bad_json_files.append({"file": name, "error": f"json error: {exc}"})

    empty_book_files = [name for name, data in rows if len(data) == 0]
    all_items = [item for _, data in rows for item in data]

    question_texts = [
        normalize_whitespace((item.get("question_text") or "")) for item in all_items
    ]
    question_lengths = [len(q) for q in question_texts if q]
    short_questions_lt_40_chars = sum(1 for n in question_lengths if n < 40)

    latex_counts = [
        len(item.get("latex_expressions") or [])
        for item in all_items
        if isinstance(item.get("latex_expressions", []), list)
    ]
    with_latex = sum(1 for c in latex_counts if c > 0)
    without_latex = sum(1 for c in latex_counts if c == 0)

    type_counts: dict[str, int] = {}
    for item in all_items:
        t = str(item.get("type") or "unknown")
        type_counts[t] = type_counts.get(t, 0) + 1

    summary = {
        "output_dir": os.path.abspath(output_dir),
        "book_files": len(rows),
        "empty_book_files": empty_book_files,
        "bad_json_files": bad_json_files,
        "total_problems": len(all_items),
        "type_counts": type_counts,
        "with_latex": with_latex,
        "without_latex": without_latex,
        "short_questions_lt40_chars": short_questions_lt_40_chars,
        "avg_question_len": round(sum(question_lengths) / len(question_lengths), 2)
        if question_lengths
        else 0,
        "median_question_len": statistics.median(question_lengths)
        if question_lengths
        else 0,
        "avg_latex_expr_per_problem": round(sum(latex_counts) / len(latex_counts), 3)
        if latex_counts
        else 0,
    }

    print("=== AUDIT SUMMARY ===")
    print(f"output_dir: {summary['output_dir']}")
    print(f"book_files: {summary['book_files']}")
    print(
        f"empty_book_files: {len(summary['empty_book_files'])} -> {summary['empty_book_files']}"
    )
    print(f"bad_json_files: {len(summary['bad_json_files'])} -> {summary['bad_json_files']}")
    print(f"total_problems: {summary['total_problems']}")
    print(f"type_counts: {summary['type_counts']}")
    print(
        f"with_latex: {summary['with_latex']} | without_latex: {summary['without_latex']}"
    )
    print(f"short_questions_lt40_chars: {summary['short_questions_lt40_chars']}")
    print(f"avg_question_len: {summary['avg_question_len']}")
    print(f"median_question_len: {summary['median_question_len']}")
    print(f"avg_latex_expr_per_problem: {summary['avg_latex_expr_per_problem']}")

    if report_path:
        write_json(report_path, summary)
        print(f"[INFO] Saved audit report -> {report_path}")

    return summary


def post_process_problem(
    raw_problem: dict[str, Any],
    book: str,
    chapter: str,
    section: str,
) -> dict[str, Any] | None:
    visible_text = clean_question_text(raw_problem.get("text", ""))
    if not visible_text:
        return None
    if len(visible_text) < 20:
        return None

    latex_sources = [normalize_latex(x) for x in (raw_problem.get("latex") or [])]
    latex_sources = [x for x in latex_sources if is_valid_latex(x)]

    if not latex_sources:
        for mml in raw_problem.get("mathml") or []:
            converted = normalize_latex(mathml_to_latex(mml))
            if is_valid_latex(converted):
                latex_sources.append(converted)

    # Deduplicate while preserving order.
    seen: set[str] = set()
    latex_expressions: list[str] = []
    for expr in latex_sources:
        expr = normalize_latex(expr)
        if not is_valid_latex(expr):
            continue
        if expr in seen:
            continue
        seen.add(expr)
        latex_expressions.append(expr)

    question_text = build_question_text(visible_text, latex_expressions)
    if not question_text:
        return None

    return {
        "book": book,
        "chapter": chapter,
        "section": section,
        "type": raw_problem.get("type", "exercise"),
        "question_text": question_text,
        "latex_expressions": latex_expressions,
    }


async def scrape_section(page: Page, section: SectionLink, book_slug: str) -> list[dict[str, Any]]:
    await page.goto(section.url, wait_until="domcontentloaded", timeout=NAVIGATION_TIMEOUT_MS)
    await wait_for_ready(page)

    raw_problems = await extract_raw_problems(page)

    cleaned: list[dict[str, Any]] = []
    for raw in raw_problems:
        problem = post_process_problem(raw, book_slug, section.chapter, section.section)
        if problem is None:
            continue
        # Skip malformed records with no meaningful content.
        if not problem["question_text"].strip():
            continue
        cleaned.append(problem)

    await asyncio.sleep(random.uniform(*PAGE_DELAY_SECONDS))
    return cleaned


async def scrape_book(browser: Browser, book_url: str, max_sections: int = 0) -> list[dict[str, Any]]:
    context = await browser.new_context()
    page = await context.new_page()

    print(f"[INFO] Discovering sections for: {book_url}")
    sections = await discover_section_links(page, book_url)

    if max_sections > 0:
        sections = sections[:max_sections]

    print(f"[INFO] Found {len(sections)} section links")

    book_slug = extract_book_slug(book_url)
    problems: list[dict[str, Any]] = []

    for idx, section in enumerate(sections, start=1):
        print(f"[INFO] [{idx}/{len(sections)}] Scraping: {section.url}")
        try:
            items = await scrape_section(page, section, book_slug)
            problems.extend(items)
        except Exception as exc:
            print(f"[WARN] Failed section: {section.url} ({exc})")

    await context.close()
    return problems


async def run(
    book_urls: list[str],
    output_dir: str,
    combined_output: str,
    headful: bool,
    max_sections: int,
) -> None:
    if not book_urls:
        raise SystemExit(
            "No book URLs supplied. Add URLs in BOOK_URLS or pass --book-url one or more times."
        )

    start = time.time()

    os.makedirs(output_dir, exist_ok=True)

    all_problems: list[dict[str, Any]] = []
    per_book_counts: dict[str, int] = {}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=not headful)

        for url in book_urls:
            try:
                problems = await scrape_book(browser, url, max_sections=max_sections)
                all_problems.extend(problems)

                slug = extract_book_slug(url)
                file_name = f"{slug_to_filename(slug)}.json"
                file_path = os.path.join(output_dir, file_name)
                write_json(file_path, problems)
                per_book_counts[file_name] = len(problems)
                print(f"[INFO] Saved {len(problems)} problems -> {file_path}")
            except Exception as exc:
                print(f"[WARN] Failed book: {url} ({exc})")
            await asyncio.sleep(random.uniform(*PAGE_DELAY_SECONDS))

        await browser.close()

    # Final cleanup: keep only non-empty, well-formed records.
    cleaned: list[dict[str, Any]] = []
    for item in all_problems:
        if not item.get("question_text"):
            continue
        if item.get("type") not in {"exercise", "example"}:
            continue
        item["latex_expressions"] = [
            x for x in item.get("latex_expressions", []) if is_valid_latex(normalize_latex(x))
        ]
        cleaned.append(item)

    # Rewrite per-book files with final cleaned latex validation.
    for url in book_urls:
        slug = extract_book_slug(url)
        file_name = f"{slug_to_filename(slug)}.json"
        file_path = os.path.join(output_dir, file_name)
        book_cleaned = [x for x in cleaned if x.get("book") == slug]
        write_json(file_path, book_cleaned)
        per_book_counts[file_name] = len(book_cleaned)

    manifest_path = os.path.join(output_dir, "manifest.json")
    write_json(
        manifest_path,
        {
            "generated_at_unix": int(time.time()),
            "book_files": per_book_counts,
            "total_problems": len(cleaned),
        },
    )

    if combined_output:
        write_json(combined_output, cleaned)
        print(f"[INFO] Saved combined output -> {combined_output}")

    elapsed = time.time() - start
    print(f"[DONE] Saved {len(cleaned)} problems in {output_dir} in {elapsed:.1f}s")


def main() -> None:
    args = parse_args()
    if args.audit_only:
        if not os.path.isdir(args.output_dir):
            raise SystemExit(f"Output folder does not exist: {args.output_dir}")
        audit_output_dir(args.output_dir, report_path=args.audit_report)
        return

    urls = build_book_urls(args)
    asyncio.run(
        run(
            urls,
            args.output_dir,
            args.combined_output,
            args.headful,
            args.max_sections_per_book,
        )
    )

    if args.audit:
        audit_output_dir(args.output_dir, report_path=args.audit_report)


if __name__ == "__main__":
    main()
