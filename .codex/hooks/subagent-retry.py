#!/usr/bin/env python3
"""VibeCoding Athena Codex PostToolUse subagent-retry v9.6.

设计 (与 CC 等价):
- 检测 spawn_agent 返回的内容是否含放弃信号词
- 注入 systemMessage 提示主 agent 重试或接管
"""
import json
import re
import sys
import datetime
import os

GIVEUP_PATTERNS = [
    re.compile(r"我(无法|不能|没法|无能力|不具备能力)"),
    re.compile(r"I (cannot|can't|am not able to|don't have access)", re.IGNORECASE),
    re.compile(r"no (capability|access|permission) to", re.IGNORECASE),
    re.compile(r"unable to (read|write|execute|access)", re.IGNORECASE),
    re.compile(r"tool not available", re.IGNORECASE),
    re.compile(r"(请|你)(自己|手动|帮我)?(运行|执行|跑)"),
    re.compile(r"please run (this|the command) (yourself|manually)", re.IGNORECASE),
]


def main():
    raw = sys.stdin.read()
    try:
        event = json.loads(raw)
    except Exception:
        sys.exit(0)
        return

    if event.get("tool_name") not in ("Task", "spawn_agent"):
        sys.exit(0)
        return

    response = event.get("tool_response") or {}
    text = ""
    if isinstance(response.get("content"), str):
        text = response["content"]
    elif isinstance(response.get("content"), list):
        text = "\n".join(c.get("text", "") for c in response["content"] if isinstance(c, dict))
    else:
        text = json.dumps(response)

    for pat in GIVEUP_PATTERNS:
        if pat.search(text):
            sys.stderr.write(f"[subagent-retry] giveup detected: {pat.pattern[:50]}\n")
            subagent = (event.get("tool_input") or {}).get("subagent_type") or (event.get("tool_input") or {}).get("agent_type") or "subagent"
            msg = f"[Athena subagent-retry] {subagent} 返回了放弃信号. 协议: 1) 再尝试一次, 用不同参数或拆分任务 2) 仍失败则主 agent 接管, 不要让用户代执行 (铁律 6 完成度证据)"
            print(json.dumps({"systemMessage": msg}))

            try:
                project_dir = os.environ.get("CODEX_PROJECT_DIR") or os.getcwd()
                state_dir = os.path.join(project_dir, ".ai_state")
                with open(os.path.join(state_dir, "hook-trace.jsonl"), "a") as f:
                    f.write(json.dumps({
                        "ts": datetime.datetime.utcnow().isoformat() + "Z",
                        "hook": "subagent-retry",
                        "subagent": subagent
                    }) + "\n")
            except Exception:
                pass
            sys.exit(0)
            return

    sys.exit(0)


if __name__ == "__main__":
    main()
