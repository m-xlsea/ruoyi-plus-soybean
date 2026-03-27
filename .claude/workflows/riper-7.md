# RIPER-7 阶段编排 v9.2.0

## 每阶段进入前 (通用)
1. 这一步要解决的核心问题是什么?
2. 项目里有没有类似实现? → 搜索 (Grep/Glob, 或 augment-context-engine 如已安装)
3. 用到的库 API 确定吗? → context7 skill 查文档
4. .ai_state/lessons.md + conventions.md 有相关经验吗?

---

## R₀ 需求精炼 (Path B+)
**技能**: brainstorm skill (含步骤0自主调研)
**产出**: .ai_state/design.md (Spec: MUST/SHOULD/COULD + 验收标准)
**门控**: cunzhi `DESIGN_READY` (cunzhi 不可用时: 直接输出 "[DESIGN_READY] 请确认" 等用户回复)

## R 技术调研 (Path B+)
**读**: design.md
**动手**: 搜索相关代码 + 查库版本和 API
**产出**: design.md 追加技术方案
**要回答**: 有没有可复用的现有代码? 需要新依赖吗?

## D 方案定稿 (Path B+)
**读**: design.md
**检查**: 接口最小化? 错误处理完整? 有没有更简单的方案?
**产出**: design.md 最终版 (含验收标准)
**门控**: cunzhi `DESIGN_FINALIZED` (cunzhi 不可用时: 直接输出确认提示)

## P 计划 (Path B+)
**技能**: plan-first skill → 生成 plan.md (T-001/T-002... 格式)
**双 Agent**: 如果 Codex 可用 → codex-review skill 对抗审查
  - CC 提交 plan.md → Codex 质疑 → CC 评估采纳/驳回 → 循环
  - 终止: VERDICT: APPROVED / 连续2轮全驳 / 超5轮
  - 审查结果持久化到 reviews/review-{uuid}.md
**如果 Codex 不可用**: CC 用 validator agent 做 Plan Review
**门控**: cunzhi `PLAN_CONFIRMED` (cunzhi 不可用时: 直接输出确认提示)

## E 执行 (Path B+) — Sisyphus 循环
对 plan.md 每个 Task:
  1. 读 Task 文本 + 相关文件 + conventions.md
  2. **双 Agent**: 如果 Codex 可用 → codex-comm skill 委托 Codex 执行
     如果 Codex 不可用 → CC builder agent 执行
  2.5. **Reflexion** (自我反思 → reflexion skill):
       "这个实现有没有: 走捷径/忽略边界/硬编码/过度工程/偏离 spec?"
       发现问题 → 立即修复
       值得记录 → lessons.md
  3. **Micro-review**: 对标 design.md spec + conventions.md 标准
     通过 → [x] Task + commit
     不通过 → 反馈修复
  **铁律**: plan.md 有任何 [ ] 未完成, 不停止。这就是 Sisyphus。

## T 测试/审查 (Path B+)
  1. verification skill: 跑测试 + 覆盖率
  1.5. **验收标准确认**:
       读 design.md "## 验收标准" → 逐条确认是否满足
       未满足 → 标注到 quality.md "## 未满足验收标准"
  2. code-review skill: 代码审查
  3. **双 Agent 互审**: 如果 Codex 可用 → CC 审查 Codex 产出 + Codex 反审 CC 修改
     如果 Codex 不可用 → CC 单方审查
  4. 综合 → quality.md
  5. **4 级 Quality Gate** (delivery-gate.cjs):
     PASS (exit 0) → 允许停止
     CONCERNS (exit 0 + stdout 警告) → 允许停止, 警告注入 context
     REWORK (exit 2) → 阻断停止, 强制修复
     FAIL (exit 2) → 阻断停止, 必须大幅修复

## V 归档 (Path B+)
  1. kaizen skill: 回顾 + lessons.md
  1.5. **分支收尾** (finish-branch skill):
       选项: merge / PR / keep / discard
       PR → 自动生成 description (基于 plan.md + quality.md)
  2. cunzhi `DELIVERY_COMPLETE` (cunzhi 不可用时: 直接输出确认提示)
