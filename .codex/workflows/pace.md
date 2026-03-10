# P.A.C.E. 复杂度路由 (v9.1.0)

## 评估维度
- 文件数 (1 / 2-10 / 10-50 / 50+)
- 预估时间 (<30min / 6-12h / 1-3天 / 1周+)
- 架构影响 (无 / 局部 / 跨模块 / 全局)

## Path A — 快速修复 (≤30min, 1-2 文件)
加载: AGENTS.md (~130L)
阶段: R(轻) → E → T(轻) → V
自动 Skills: [R] context7 | [E] tdd(L1) | [T] verification | [V] kaizen
检查点: cunzhi [DELIVERY_CONFIRMED]

## Path B — 计划开发 (6-12h, 2-10 文件)
加载: + workflows + 6 skills (~540L)
阶段与自动 Skills:
  R₀b: **brainstorm** → spec + design.md → cunzhi [DESIGN_DIRECTION]
  R: augment-context/deepwiki → **context7** → 更新 design.md
  D: **context7** 查 API → design.md 终稿 → cunzhi [DESIGN_READY]
  P: **plan-first** + /plan 原生 → plan.md → cunzhi [PLAN_CONFIRMED]
  E: **tdd**(L2, 强制 RED→GREEN) → doing.md 看板
  T: **verification** + **code-review** + /review 原生 → verified.md
  V: Kaizen 复盘 → cunzhi [DELIVERY_CONFIRMED]

## Path C — 系统开发 (1-3 天, 10-50 文件)
加载: + agent-teams + e2e-testing (~700L)
同 Path B + :
  E: **agent-teams** 并行 (多代理协作, [agents] 角色)
  T: + **e2e-testing** → cunzhi [TESTS_PASSED]
  V: 按功能分 commit + **kaizen**

## Path D — 企业级 (1周+, 50+ 文件)
同 Path C + :
  T: + security-review → cunzhi [SECURITY_PASSED]
  V: 分 PR 交付, 每个 PR 独立审查 + **kaizen**
  Profile: `codex --profile review` 用于最终审查

## 路径选择规则
1. 默认 Path A, 除非满足升级条件
2. 用户明确说 "简单修一下" → 不要升级到 B
3. 不确定 → 问用户确认复杂度
