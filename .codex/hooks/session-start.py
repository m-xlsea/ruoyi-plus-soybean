#!/usr/bin/env python3
"""VibeCoding Athena Codex SessionStart hook v9.6.

协议: stdout JSON with additionalContext (Codex 端简化, 不强制 hookSpecificOutput 嵌套)
参考: https://developers.openai.com/codex/hooks

设计 (铁律 8 索引先行, 同 CC):
- 唯一 IO: read .ai_state/_index.md frontmatter
- 注入 context-essentials.md (静态文本)
- 注入 _index.md 关键字段摘要
"""
import json
import os
import re
import sys
import datetime

PROJECT_DIR = os.environ.get("CODEX_PROJECT_DIR") or os.getcwd()
STATE_DIR = os.path.join(PROJECT_DIR, ".ai_state")
INDEX_PATH = os.path.join(STATE_DIR, "_index.md")

HOME = os.path.expanduser("~")
PROJECT_ESSENTIALS = os.path.join(PROJECT_DIR, ".codex", "skills", "pace", "context-essentials.md")
GLOBAL_ESSENTIALS = os.path.join(HOME, ".codex", "skills", "pace", "context-essentials.md")


def trace(payload: dict):
    try:
        line = json.dumps({"ts": datetime.datetime.utcnow().isoformat() + "Z", "hook": "session-start", **payload}) + "\n"
        with open(os.path.join(STATE_DIR, "hook-trace.jsonl"), "a") as f:
            f.write(line)
    except Exception:
        pass


def read_file_safe(path: str) -> str:
    try:
        with open(path, "r") as f:
            return f.read().strip()
    except Exception:
        return ""


def get_frontmatter(content: str) -> str:
    m = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    return m.group(1) if m else ""


def get_str(fm: str, key: str) -> str:
    m = re.search(rf"^  {re.escape(key)}: (.*)$", fm, re.MULTILINE)
    if not m:
        return ""
    val = m.group(1).strip()
    return val.strip('"').strip("'")


def get_num(fm: str, key: str) -> int:
    m = re.search(rf"^  {re.escape(key)}: (\d+)$", fm, re.MULTILINE)
    return int(m.group(1)) if m else 0


def main():
    raw = sys.stdin.read()
    try:
        event = json.loads(raw)
    except Exception:
        event = {}
    source = event.get("source", "unknown")

    lines = []

    # 1. 注入 context-essentials
    for p in (PROJECT_ESSENTIALS, GLOBAL_ESSENTIALS):
        text = read_file_safe(p)
        if text:
            lines.append(text)
            break
    if not lines:
        lines.append("[VibeCoding Athena Codex v9.6] TDD · Review · Sisyphus · 索引先行")

    # 2. 注入 _index.md frontmatter 摘要
    if os.path.exists(INDEX_PATH):
        try:
            content = open(INDEX_PATH).read()
            fm = get_frontmatter(content)
            if fm:
                path_ = get_str(fm, "path")
                stage = get_str(fm, "stage")
                sprint = get_num(fm, "sprint")
                goal = get_str(fm, "active_goal")
                pending = get_num(fm, "tasks_pending")
                done = get_num(fm, "tasks_done")
                blocked = get_num(fm, "tasks_blocked")

                if path_ and stage:
                    lines.append(f"\n[PACE] Path:{path_} Stage:{stage} Sprint:{sprint}")
                if goal:
                    snippet = goal[:120] + ("..." if len(goal) > 120 else "")
                    lines.append(f"[/goal active (CC only)] {snippet}")
                if pending + done + blocked > 0:
                    lines.append(f"[任务] {done} 完成 {pending} 待办 {blocked} 阻塞 (详见 details/tasks-current.md)")
        except Exception as e:
            sys.stderr.write(f"[session-start] _index.md parse failed: {e}\n")

    additional_context = "\n".join(lines)
    sys.stderr.write(f"[session-start/{source}] injected {len(additional_context)} chars\n")
    trace({"source": source, "chars": len(additional_context)})

    # Codex hooks 输出协议: stdout 包含 additionalContext 字符串 (官方文档示例)
    # 参考: https://developers.openai.com/codex/hooks 中 SessionStart 段
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": additional_context
        }
    }))
    sys.exit(0)


if __name__ == "__main__":
    main()
