---
name: plan-first
description: 强制先规划后执行 — 基于 design.md 生成计划
context: main
---
## 触发: Path B+ 任务, brainstorm 完成后

## 步骤
1. 读 .ai_state/design.md 作为规划输入
2. 进入规划模式 (分析 design.md, 分解为可执行任务)
3. context7 查询任务涉及的库文档, 确保技术细节准确
4. 输出到 .ai_state/plan.md:
   - [ ] 任务列表 (checkbox 格式)
   - 依赖关系
   - 预估时间
   - 子代理分配 (Path C+)
5. cunzhi [PLAN_CONFIRMED] 确认后才能写代码
6. plan.md 未完成任务 → delivery-gate 阻塞

## 管道: brainstorm → context7 → plan-first → E
