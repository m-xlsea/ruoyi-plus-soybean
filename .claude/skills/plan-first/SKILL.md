---
name: plan-first
description: P 阶段计划生成 — design.md 确认后激活
---
# Plan-First (P 阶段)

## 流程
1. 读 .ai_state/design.md 全文
2. 分解为可执行任务, 每个任务:
   ```
   - [ ] T-001: {动作动词} + {目标} + {验收条件}
         文件: {涉及文件}
         依赖: {前置任务}
   ```
3. 任务排序: 依赖拓扑 → 风险高的先做
4. 写入 .ai_state/plan.md

## 计划质量检查
- 每个任务有明确的"完成"定义
- 没有模糊词 ("优化", "改进" → 改为具体指标)
- 估算总任务数, 超过 15 个考虑拆分 milestone

## 双 Agent 对抗审查
如果 Codex 可用 → 触发 codex-review skill 做对抗式审查
如果 Codex 不可用 → CC 用 validator agent 自审:
  "作为审查者, 这个计划有哪些漏洞/模糊/不可执行的部分?"
