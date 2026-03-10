# RIPER-7 阶段编排 (v9.1.0)

## 阶段流: R₀ → R → D → P → E → T → V

### R₀ (预研/头脑风暴, Path B+ 独有)
触发: /vibe-dev 且 PACE≥B
**自动加载**: brainstorm skill
工具: augment-context + cunzhi
输入: 用户需求
输出: .ai_state/design.md (含 spec 需求模板 + 方案草案)
检查点: cunzhi [DESIGN_DIRECTION]
技巧: 可用 /fork 并行探索不同方案方向

### R (研究)
触发: R₀ 确认后 或 Path A 直接进入
**自动加载**: context7 skill
工具: augment-context + deepwiki + WebSearch
输入: design.md 或 用户需求
输出: 更新 design.md (技术细节)

### D (设计, Path B+ 独有)
触发: R 完成
**自动加载**: context7 skill
输入: design.md
输出: design.md 终稿 (接口定义/数据结构/模块划分)
检查点: cunzhi [DESIGN_READY]

### P (规划, Path B+ 独有)
触发: D 确认后
**自动加载**: plan-first skill
输入: design.md
输出: .ai_state/plan.md (任务列表+依赖+预估+子代理分配)
检查点: cunzhi [PLAN_CONFIRMED]

### E (执行)
触发: P 确认后 或 Path A R 完成
**自动加载**: tdd skill (强制模式) + agent-teams (Path C+)
铁律: **先写测试, 再写实现, 测试红了才能写代码**
输入: plan.md (B+) 或 需求描述 (A)
过程:
  - Path A: 直接开发, 功能验证
  - Path B: tdd L2 (RED→GREEN→REFACTOR), doing.md 看板
  - Path C/D: agent-teams 并行, worktree 隔离
输出: .ai_state/doing.md 更新, 代码变更
Hook: PostToolUse TDD 检查 (写源码前是否有测试)

### T (测试/验证)
触发: E 完成
**自动加载**: verification + code-review skills
工具: validator 子代理 + code-review skill
输入: 代码变更
过程:
  - Path A: 功能验证 + lint
  - Path B: verification + code-review → verified.md
  - Path C/D: + e2e-testing + security-review
输出: .ai_state/verified.md
检查点: cunzhi [TESTS_PASSED] (C+: [SECURITY_PASSED])

### V (验收/交付)
触发: T 通过
**自动执行**: delivery-gate hook + LLM-as-Judge prompt hook
过程:
  1. delivery-gate 机械检查: plan 无未完成项 + 测试通过
  2. LLM-as-Judge: 代码质量/测试覆盖/commit 规范/无密钥泄露
  3. cunzhi [DELIVERY_CONFIRMED] 用户确认
  4. **Kaizen 复盘** (必须):
     a. git diff --stat 分析本次变更范围
     b. 提炼经验教训 → 写入 .ai_state/knowledge.md
     c. 发现的陷阱 → 写入 .ai_state/lessons.md
     d. 更新 .ai_state/conventions.md (如有新规范)
  5. 归档 → .ai_state/archive.md
输出: 交付完成 + 经验沉淀
