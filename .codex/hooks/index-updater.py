#!/usr/bin/env python3
"""VibeCoding Athena Codex PostToolUse index-updater v9.6.

设计 (与 CC 等价, schema 跨平台一致 - 铁律 6):
- 检测 tool_input.file_path 是否在 .ai_state/details/
- 若是 → 重新扫描计算 counts/fingerprints/pointers
- 原子写入 _index.md (.tmp + rename)
"""
import json
import os
import re
import sys
import datetime

PROJECT_DIR = os.environ.get("CODEX_PROJECT_DIR") or os.getcwd()
STATE_DIR = os.path.join(PROJECT_DIR, ".ai_state")
INDEX_PATH = os.path.join(STATE_DIR, "_index.md")
DETAILS_DIR = os.path.join(STATE_DIR, "details")


def read_file_safe(path):
    try:
        return open(path).read()
    except Exception:
        return ""


def mtime(path):
    try:
        return int(os.path.getmtime(path) * 1000)
    except Exception:
        return 0


def count_matches(text, pattern):
    return len(re.findall(pattern, text, re.MULTILINE)) if text else 0


def last_section_line(text, head_prefix="## "):
    if not text:
        return 0
    lines = text.split("\n")
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].startswith(head_prefix):
            return i + 1
    return 0


def last_nonempty_line(text):
    if not text:
        return 0
    lines = text.split("\n")
    for i in range(len(lines) - 1, -1, -1):
        s = lines[i].strip()
        if s and not s.startswith("<!--") and not s.startswith("-->") and not s.startswith("#"):
            return i + 1
    return 0


def replace_field(yaml: str, key: str, value, is_numeric: bool) -> str:
    val_str = str(value) if is_numeric else f'"{value}"'
    pattern = rf"(^  {re.escape(key)}: ).*$"
    if re.search(pattern, yaml, re.MULTILINE):
        return re.sub(pattern, rf"\g<1>{val_str}", yaml, count=1, flags=re.MULTILINE)
    return yaml


def main():
    raw = sys.stdin.read()
    try:
        event = json.loads(raw)
    except Exception:
        sys.exit(0)
        return

    file_path = (event.get("tool_input") or {}).get("file_path", "")
    if not file_path or ".ai_state/details/" not in file_path:
        sys.exit(0)
        return
    if not os.path.exists(INDEX_PATH):
        sys.exit(0)
        return

    try:
        content = open(INDEX_PATH).read()
        m = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
        if not m:
            sys.stderr.write("[index-updater] frontmatter parse failed\n")
            sys.exit(0)
            return
        fm, body = m.group(1), m.group(2)

        tasks_text = read_file_safe(os.path.join(DETAILS_DIR, "tasks-current.md"))
        progress_text = read_file_safe(os.path.join(DETAILS_DIR, "progress.md"))
        lessons_text = read_file_safe(os.path.join(DETAILS_DIR, "lessons.md"))
        proposals_text = read_file_safe(os.path.join(DETAILS_DIR, "proposals.md"))

        tasks_pending = count_matches(tasks_text, r"^- \[ \]")
        tasks_done = count_matches(tasks_text, r"^- \[x\]")
        tasks_blocked = count_matches(tasks_text, r"^- \[!\]")
        lessons_lines = count_matches(lessons_text, r"^## ")

        progress_entries = 0
        if progress_text:
            progress_entries = sum(
                1 for l in progress_text.split("\n")
                if l.strip() and not l.startswith("<!--") and not l.startswith("-->") and not l.startswith("#")
            )

        reviews_count = 0
        latest_review = ""
        try:
            files = [f for f in os.listdir(os.path.join(DETAILS_DIR, "reviews")) if re.match(r"^sprint-\d+\.md$", f)]
            reviews_count = len(files)
            if files:
                files.sort(key=lambda f: int(re.search(r"\d+", f).group()))
                latest_review = f"details/reviews/{files[-1]}"
        except Exception:
            pass

        latest_progress = f"details/progress.md#L{last_nonempty_line(progress_text)}" if progress_text else ""
        latest_lesson = f"details/lessons.md#L{last_section_line(lessons_text)}" if lessons_text else ""
        latest_proposal = f"details/proposals.md#L{last_section_line(proposals_text)}" if proposals_text else ""

        tasks_mtime = mtime(os.path.join(DETAILS_DIR, "tasks-current.md"))
        design_mtime = mtime(os.path.join(DETAILS_DIR, "design.md"))
        progress_mtime = mtime(os.path.join(DETAILS_DIR, "progress.md"))
        lessons_mtime = mtime(os.path.join(DETAILS_DIR, "lessons.md"))

        fm = replace_field(fm, "tasks_pending", tasks_pending, True)
        fm = replace_field(fm, "tasks_done", tasks_done, True)
        fm = replace_field(fm, "tasks_blocked", tasks_blocked, True)
        fm = replace_field(fm, "lessons_lines", lessons_lines, True)
        fm = replace_field(fm, "progress_entries", progress_entries, True)
        fm = replace_field(fm, "reviews_count", reviews_count, True)
        fm = replace_field(fm, "latest_progress", latest_progress, False)
        fm = replace_field(fm, "latest_review", latest_review, False)
        fm = replace_field(fm, "latest_lesson", latest_lesson, False)
        fm = replace_field(fm, "latest_proposal", latest_proposal, False)
        fm = replace_field(fm, "tasks_mtime", tasks_mtime, True)
        fm = replace_field(fm, "design_mtime", design_mtime, True)
        fm = replace_field(fm, "progress_mtime", progress_mtime, True)
        fm = replace_field(fm, "lessons_mtime", lessons_mtime, True)

        new_content = f"---\n{fm}\n---\n{body}"
        tmp = INDEX_PATH + ".tmp"
        with open(tmp, "w") as f:
            f.write(new_content)
        os.rename(tmp, INDEX_PATH)
        sys.stderr.write(f"[index-updater] _index.md updated (pending={tasks_pending} done={tasks_done})\n")

        with open(os.path.join(STATE_DIR, "hook-trace.jsonl"), "a") as f:
            f.write(json.dumps({
                "ts": datetime.datetime.utcnow().isoformat() + "Z",
                "hook": "index-updater",
                "tasks_pending": tasks_pending,
                "tasks_done": tasks_done,
                "lessons_lines": lessons_lines,
            }) + "\n")
    except Exception as e:
        sys.stderr.write(f"[index-updater] failed: {e}\n")

    sys.exit(0)


if __name__ == "__main__":
    main()
