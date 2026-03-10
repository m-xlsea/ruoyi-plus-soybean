# VibeCoding Kernel v9.1.0

## 铁律 (违反即失败)

1. **先搜后写**: augment-context-engine 搜现有实现 → 不可用时 grep -r
2. **先规后码**: Path B+ 任务必须先 plan.md → cunzhi [PLAN_CONFIRMED] 后才能写代码
3. **先测后码**: E 阶段写功能代码前必须先写/更新测试 (RED→GREEN→REFACTOR)
4. **不确定就问**: 歧义/架构决策 → cunzhi 向用户确认, 不猜
5. **不破坏已有**: 改代码前读测试, 改后跑测试, 红了就修
6. **compact 前存档**: /compact 前把关键决策写入 .ai_state/knowledge.md
7. **只改需要改的**: 不重构任务范围外的代码, 不加未要求的功能
8. **避免过度工程**: 用最简方案解决问题, YAGNI 优先
9. **commit 粒度**: 每个逻辑变更独立 commit, message 用 conventional commits
10. **交付必复盘**: V 阶段完成后必须 diff 分析→提炼 lessons→写入 knowledge.md

## 系统入口

- `/vibe-dev {需求}` — 自动 P.A.C.E. 路由, 开始开发
- `/vibe-init` — 初始化 .ai_state/, 新项目用
- `/vibe-resume` — 中断恢复 (读 .ai_state/ 断点)
- `/vibe-status` — 查看当前进度

## 子代理 (5 个, sonnet 模型)

builder (background) / validator / explorer / e2e-runner / security-auditor

## 工作流

P.A.C.E. 路由 → RIPER-7 阶段 → Skills **自动触发** (非手动调用)
每个 RIPER 阶段绑定必须执行的 skills, 详见 .claude/workflows/

## 质量门 (hooks 自动执行)

- PostToolUse: TDD 检查 (写源码前是否有测试)
- Stop: LLM-as-Judge 交付审查 + delivery-gate 机械检查
- SubagentStop: 子代理产出审查

## 状态持久化

.ai_state/ 目录: session → design → plan → doing → verified → review → archive
/memory 管理跨会话记忆 (官方 auto-memory)

## MCP (配置于 .mcp.json)

augment-context-engine / cunzhi / mcp-deepwiki
降级: augment→grep | cunzhi→对话确认 | deepwiki→WebSearch
