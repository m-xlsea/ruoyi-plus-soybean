---
name: vibe-dev
description: 智能开发入口 — 自动路由到完整工程流程
allowed-tools: Read, Write, Bash, mcp__cunzhi__*, mcp__augment-context-engine__*, mcp__mcp-deepwiki__*
---

# /vibe-dev — 智能开发入口

用户说 `/vibe-dev "做个搜索功能"` 后:

1. 检查 .ai_state/ 是否存在, 不存在则先跑 quickstart
2. augment-context-engine 快速扫描项目
3. P.A.C.E. 路由 (workflows/pace.md) → 判定 Path
4. 向用户展示任务分析和执行计划预览
5. cunzhi 确认 Path 选择
6. 进入 RIPER-7 (workflows/riper-7.md) 按阶段执行

这是最常用的入口。新手直接用这个就行。
