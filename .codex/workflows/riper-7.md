# RIPER-7 阶段编排 v9.2.0

## 每阶段进入前 (通用)
1. 这一步要解决的核心问题是什么?
2. 项目里有没有类似实现? → 搜索相关代码
3. 用到的库 API 确定吗? → context7 skill 查文档
4. .ai_state/lessons.md + conventions.md 有相关经验吗?

---

## R₀ 需求精炼 (Path B+)
**技能**: brainstorm skill (含步骤0自主调研)
**产出**: .ai_state/design.md (Spec: MUST/SHOULD/COULD + 验收标准)
**门控**: cunzhi `DESIGN_READY` (cunzhi 不可用时: 直接输出 "[DESIGN_READY] 请确认" 等用户回复)

## R 技术调研 (Path B+)
读 design.md → 搜索相关代码 + 查库文档
产出: design.md 追加技术方案

## D 方案定稿 (Path B+)
读 design.md → 检查接口最小化? 错误处理完整? 更简单的方案?
产出: design.md 最终版
门控: cunzhi `DESIGN_FINALIZED` (cunzhi 不可用时: 直接输出确认提示)

## P 计划 (Path B+)
技能: plan-first skill → 生成 plan.md
**计划审查**: 用 /review 内置功能审查, 或用 validator agent
门控: cunzhi `PLAN_CONFIRMED` (cunzhi 不可用时: 直接输出确认提示)

## E 执行 (Path B+) — Sisyphus 循环
对 plan.md 每个 Task:
  1. 读 Task + 相关文件 + conventions.md
  2. TDD: 先写测试 → 实现 → 重构
  2.5. **Reflexion** (自我反思 → reflexion skill):
       "这个实现有没有: 走捷径/忽略边界/硬编码/过度工程/偏离 spec?"
       发现问题 → 立即修复
       值得记录 → lessons.md
  3. **Micro-review**: 对标 design.md spec + conventions.md
     通过 → [x] Task + commit
     不通过 → 修复
  **铁律**: plan.md 有任何 [ ] 未完成, 不停止。

## T 测试/审查 (Path B+)
  1. verification skill: 跑测试 + 覆盖率
  1.5. **验收标准确认**:
       读 design.md "## 验收标准" → 逐条确认是否满足
       未满足 → 标注到 quality.md
  2. code-review skill: 代码审查
  3. 用 /review 内置审查功能 做代码审查
  4. 综合 → quality.md
  5. Quality Gate: PASS(exit 0) / CONCERNS(exit 0+warn) / REWORK(exit 2) / FAIL(exit 2)

## V 归档 (Path B+)
  1. kaizen skill: 回顾 + lessons.md
  1.5. **分支收尾** (finish-branch skill):
       选项: PR description / keep / discard (Codex 不直接 merge)
  2. cunzhi `DELIVERY_COMPLETE` (cunzhi 不可用时: 直接输出确认提示)
