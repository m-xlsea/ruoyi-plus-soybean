---
name: vibe-status
description: 查看当前任务状态和进度
allowed-tools: Read, Bash
---

# /vibe-status — 状态查看

1. 读 .ai_state/session.md → 当前 Path + 阶段
2. 读 .ai_state/doing.md → TODO/DOING/DONE 统计
3. 如果有活跃 Agent Teams: `claude agents` 列出活跃子代理
4. 输出看板:
   ```
   📊 VibeCoding 状态
   ├─ 版本: v8.9
   ├─ Path: B | 阶段: E (执行)
   ├─ 进度: ████████░░ 4/5 (80%)
   ├─ TODO: T-005 (实现搜索过滤)
   ├─ DOING: —
   ├─ DONE: T-001, T-002, T-003, T-004
   └─ Agents: builder (active), validator (idle)
   ```
