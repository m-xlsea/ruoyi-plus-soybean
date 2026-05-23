#!/usr/bin/env python3
"""VibeCoding Athena Codex Stop hook (delivery-gate) v9.6.

设计:
- Codex 无 /goal autonomous loop → Athena 必须自己判定 VERDICT
- Codex 无 Stop hook block-cap 概念, 但保守起见也做内部计数
- VERDICT 不符 → 阻断 (decision: block)
- CONCERNS → systemMessage 不阻断
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
COUNTER_PATH = os.path.join(HOME, ".codex", "state", "athena-block-counter.json")

BLOCK_CAP_SAFE = 6


def trace(payload: dict):
    try:
        with open(os.path.join(STATE_DIR, "hook-trace.jsonl"), "a") as f:
            f.write(json.dumps({
                "ts": datetime.datetime.utcnow().isoformat() + "Z",
                "hook": "delivery-gate",
                **payload
            }) + "\n")
    except Exception:
        pass


def main():
    raw = sys.stdin.read()
    try:
        event = json.loads(raw)
    except Exception:
        sys.exit(0)
        return

    if event.get("stop_hook_active"):
        sys.exit(0)
        return
    if event.get("agent_type") and event["agent_type"] != "main":
        sys.exit(0)
        return
    if not os.path.exists(INDEX_PATH):
        sys.exit(0)
        return

    try:
        content = open(INDEX_PATH).read()
        m = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
        if not m:
            sys.exit(0)
            return
        fm = m.group(1)
    except Exception:
        sys.exit(0)
        return

    def get_str(key):
        match = re.search(rf'^  {re.escape(key)}: (.*)$', fm, re.MULTILINE)
        return match.group(1).strip().strip('"').strip("'") if match else ""

    def get_num(key):
        match = re.search(rf'^  {re.escape(key)}: (\d+)$', fm, re.MULTILINE)
        return int(match.group(1)) if match else 0

    path_name = get_str("path")
    stage = get_str("stage")
    sprint = get_num("sprint")
    tasks_pending = get_num("tasks_pending")

    if not sprint or not stage or path_name in ("Hotfix", "Bugfix") or stage != "review":
        sys.exit(0)
        return

    needs_ext = path_name in ("Feature", "Refactor", "System")
    issues = []

    if tasks_pending > 0:
        issues.append(f"{tasks_pending} Task 未完成")

    review_file = os.path.join(STATE_DIR, "details", "reviews", f"sprint-{sprint}.md")
    rc = ""
    try:
        rc = open(review_file).read()
    except Exception:
        issues.append("审查报告不存在")

    if needs_ext and rc and not re.search(r"reviewer|web_search|/review|spawn_agent", rc, re.IGNORECASE):
        issues.append("无外部审查记录")
    if rc and not re.search(r"test|测试|pass|通过|✅", rc, re.IGNORECASE):
        issues.append("无测试通过记录")

    verdict = ""
    if rc:
        vm = re.search(r"VERDICT:\s*(PASS|CONCERNS|REWORK|FAIL)", rc, re.IGNORECASE)
        if vm:
            verdict = vm.group(1).upper()
            if verdict in ("REWORK", "FAIL"):
                issues.append(f"VERDICT={verdict}")

    if issues:
        os.makedirs(os.path.dirname(COUNTER_PATH), exist_ok=True)
        counter = {}
        try:
            counter = json.load(open(COUNTER_PATH))
        except Exception:
            pass
        sid = event.get("session_id", "unknown")
        counter[sid] = counter.get(sid, 0) + 1
        try:
            with open(COUNTER_PATH, "w") as f:
                json.dump(counter, f)
        except Exception:
            pass
        count = counter[sid]

        sys.stderr.write(f"[delivery-gate] block #{count}/{BLOCK_CAP_SAFE} {path_name}/{stage}: {', '.join(issues)}\n")
        trace({"action": "block", "count": count, "path": path_name, "stage": stage, "issues": issues})

        if count >= BLOCK_CAP_SAFE:
            msg = f"[Athena] 已连续 block {count} 次, 建议手动处理: {'; '.join(issues)}"
            print(json.dumps({"systemMessage": msg}))
        else:
            print(json.dumps({
                "decision": "block",
                "reason": f"[Athena delivery-gate] 阻断:\n" + "\n".join("• " + i for i in issues) + f"\n\n修复后再交付 (block {count}/{BLOCK_CAP_SAFE})."
            }))
        sys.exit(0)
        return

    # 通过, 重置计数
    try:
        counter = json.load(open(COUNTER_PATH))
        counter.pop(event.get("session_id", ""), None)
        with open(COUNTER_PATH, "w") as f:
            json.dump(counter, f)
    except Exception:
        pass

    if verdict == "PASS":
        # 检查 lessons
        try:
            lessons = open(os.path.join(STATE_DIR, "details", "lessons.md")).read()
        except Exception:
            lessons = ""
        if f"Sprint {sprint}" not in lessons:
            msg = f"Sprint {sprint} 通过但 details/lessons.md 无条目, 建议运行 compound skill 沉淀经验"
            print(json.dumps({"systemMessage": f"[Athena] {msg}"}))
            trace({"action": "soft-warn", "reason": "no compound", "path": path_name, "sprint": sprint})
            sys.exit(0)
            return

    sys.stderr.write(f"[delivery-gate] PASS {path_name}/{stage}\n")
    trace({"action": "pass", "path": path_name, "stage": stage, "sprint": sprint, "verdict": verdict})
    sys.exit(0)


if __name__ == "__main__":
    main()
