# /athena-review (Codex)

有 `.ai_state/_index.md` → 按当前 Path 触发 pace skill 审查阶段。
无 → 快速审查 (Codex 内置 /review)。

焦点: $ARGUMENTS

Codex 端可用工具:
- `/review` (Codex 内置)
- `spawn_agent reviewer` (从 ~/.codex/agents/reviewer.toml 调度)
- `web_search` 查最佳实践
- 不可: /codex:review (那是 CC 侧反向调用)
