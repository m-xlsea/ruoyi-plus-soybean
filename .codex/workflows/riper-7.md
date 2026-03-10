# RIPER-7 阶段编排 (v9.1.0)

## 阶段流: R₀ → R → D → P → E → T → V

### R₀ (预研/头脑风暴, Path B+ 独有)
触发: 用户提交需求且 PACE≥B
**自动加载**: brainstorm skill
工具: augment-context + cunzhi
输入: 用户需求
输出: .ai_state/design.md (含 spec 需求模板 + 方案草案)
检查点: cunzhi [DESIGN_DIRECTION]

### R (研究)
触发: R₀ 确认后 或 Path A 直接进入
**自动加载**: context7 skill
工具: augment-context + deepwiki + web search
输入: design.md 或 用户需求
输出: 更新 design.md (技术细节)

### D (设计, Path B+ 独有)
触发: R 完成
**自动加载**: context7 skill
输入: design.md
输出: design.md 终稿
检查点: cunzhi [DESIGN_READY]

### P (规划, Path B+ 独有)
触发: D 确认后
**自动加载**: plan-first skill + /plan 原生规划
输入: design.md
输出: .ai_state/plan.md
检查点: cunzhi [PLAN_CONFIRMED]

### E (执行)
触发: P 确认后 或 Path A R 完成
**自动加载**: tdd skill (强制模式) + agent-teams (Path C+)
铁律: **先写测试, 再写实现**
过程:
  - Path A: 直接开发, 功能验证
  - Path B: tdd L2 (RED→GREEN→REFACTOR), doing.md 看板
  - Path C/D: agent-teams 多代理并行
输出: .ai_state/doing.md, 代码变更

### T (测试/验证)
触发: E 完成
**自动加载**: verification + code-review skills
工具: /review 原生代码审查
过程:
  - Path A: 功能验证 + lint
  - Path B: verification + code-review → verified.md
  - Path C/D: + e2e-testing + security-review
输出: .ai_state/verified.md
检查点: cunzhi [TESTS_PASSED]

### V (验收/交付)
触发: T 通过
过程:
  1. 验证: plan 无未完成项 + 测试通过
  2. cunzhi [DELIVERY_CONFIRMED] 用户确认
  3. **Kaizen 复盘** (必须):
     a. git diff --stat 分析变更范围
     b. 提炼经验 → .ai_state/knowledge.md
     c. 记录陷阱 → .ai_state/lessons.md
     d. 更新 conventions.md (如有新规范)
  4. 归档 → .ai_state/archive.md
输出: 交付完成 + 经验沉淀
