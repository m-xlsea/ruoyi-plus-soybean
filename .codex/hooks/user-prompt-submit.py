#!/usr/bin/env python3
"""VibeCoding Athena Codex UserPromptSubmit hook v9.6.

仅在用户 prompt 看起来是"开发请求" 时, 提示当前 PACE 状态, 帮助 model 路由.
不强制添加任何内容, 单纯增强 context.

参考: https://developers.openai.com/codex/hooks
"""
import json
import os
import re
import sys
import datetime

PROJECT_DIR = os.environ.get("CODEX_PROJECT_DIR") or os.getcwd()
STATE_DIR = os.path.join(PROJECT_DIR, ".ai_state")
INDEX_PATH = os.path.join(STATE_DIR, "_index.md")

DEV_KEYWORDS = re.compile(
    r"(实现|开发|新增|加上|做|搭|跑|写|改|修|fix|implement|build|add|create|refactor|review|test|debug)",
    re.IGNORECASE,
)


def main():
    raw = sys.stdin.read()
    try:
        event = json.loads(raw)
    except Exception:
        sys.exit(0)
        return

    prompt = event.get("prompt") or event.get("user_prompt") or ""
    if not DEV_KEYWORDS.search(prompt):
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
        path_m = re.search(r'^  path: "([^"]*)"$', fm, re.MULTILINE)
        stage_m = re.search(r'^  stage: "([^"]*)"$', fm, re.MULTILINE)
        path_val = path_m.group(1) if path_m else ""
        stage_val = stage_m.group(1) if stage_m else ""

        if path_val and stage_val:
            msg = f"[Athena] 当前 PACE 状态: {path_val}/{stage_val}. 如果是延续任务, 请走 pace skill 既有流程; 如果是新任务, 评估是否升路径."
            sys.stderr.write(msg + "\n")
            print(json.dumps({"systemMessage": msg}))

            try:
                line = json.dumps({
                    "ts": datetime.datetime.utcnow().isoformat() + "Z",
                    "hook": "user-prompt-submit",
                    "path": path_val, "stage": stage_val
                }) + "\n"
                with open(os.path.join(STATE_DIR, "hook-trace.jsonl"), "a") as f:
                    f.write(line)
            except Exception:
                pass
    except Exception as e:
        sys.stderr.write(f"[user-prompt-submit] failed: {e}\n")

    sys.exit(0)


if __name__ == "__main__":
    main()
