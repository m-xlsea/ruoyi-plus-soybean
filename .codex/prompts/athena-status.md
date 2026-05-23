# /athena-status (Codex)

参考 CC 版 (~/.claude/skills/athena-status/SKILL.md). 等价实现, 差异:

| 字段 | CC 端 | CX 端 |
|------|-------|-------|
| goal_supported | CC v2.1.139+ | **始终 false** (Codex 无 /goal) |
| batch_supported | CC v2.1.121+ | 视 [agents] max_threads 而定 |
| background_supported | CC v2.1.139+ | **始终 false** (Codex 无 /background) |
| session_memory_active | ~/.claude/projects/ | **始终 false** (Codex 无等价) |

## 收集顺序 (同 CC 版)

1. PACE 状态 (从 `.ai_state/_index.md` frontmatter)
2. Sprint 进度 (counts 段)
3. Hook 触发记录 (`tail -50 .ai_state/hook-trace.jsonl`)
4. Lessons 统计
5. Platform 健康 (Codex 特定)
6. Plugin 状态: CX 无插件生态, 仅显示 `codex --version`, `codex /hooks` 输出, `codex /skills`

## Codex 特有显示

```
[Codex Hooks]
  /hooks tui:           v0.129+
  hooks 配置文件:        ~/.codex/hooks.json, ~/.codex/config.toml [[hooks.*]]
  Windows 支持:         否 (官方限制)

[Codex Subagents]
  config.toml [agents].max_threads: <从 config 读>
  available roles: evaluator, generator, reviewer
```
