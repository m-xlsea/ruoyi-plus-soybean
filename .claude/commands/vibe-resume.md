---
name: vibe-resume
description: 中断恢复 — 从上次中断的地方继续
allowed-tools: Read, Write, Bash, mcp__cunzhi__*, mcp__augment-context-engine__*
---

# /vibe-resume — 中断恢复

1. 读 .ai_state/session.md → 获取中断时的 Path + 阶段
2. 读 .ai_state/doing.md → 获取未完成的 TODO
3. augment-context-engine 快速扫描最近变更
4. 向用户展示恢复摘要:
   ```
   🔄 恢复上次任务
   ├─ Path: B
   ├─ 中断阶段: E (执行)
   ├─ 已完成: T-001, T-002
   ├─ 待继续: T-003, T-004
   └─ 最后变更: src/auth/login.ts
   ```
5. cunzhi 确认后继续

等效于 `/resume` 官方命令 + VibeCoding 上下文恢复。
