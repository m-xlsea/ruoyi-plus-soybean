---
name: plan-first
description: 强制先规划后执行 — P 阶段
context: main
---

## 触发
Path B+ 任务, D 阶段完成后。

## 流程

1. 读 .ai_state/design.md (brainstorm/R/D 阶段输出)
2. 使用 /plan 进入规划模式
3. context7 查询任务涉及的库文档, 确保技术细节准确
4. 输出 .ai_state/plan.md:
   - 任务列表 (编号 T-001, T-002...)
   - 依赖关系 (T-003 depends on T-001)
   - 时间预估
   - Path C+: 子代理分配
5. cunzhi [PLAN_CONFIRMED] 确认后才能写代码
6. plan.md 中未完成任务不能关闭 session (delivery-gate 检查)

## 管道
design.md (上游) → plan-first → plan.md (下游) → E 阶段消费
