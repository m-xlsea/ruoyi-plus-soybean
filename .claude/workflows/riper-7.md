# RIPER-7 工程编排 v8.9

## 统一工具调度表

| 阶段 | VibeCoding Skill | Plugin | MCP | 状态文件 |
|:---|:---|:---|:---|:---|
| R₀b 头脑风暴 | brainstorm | superpowers (brainstorming) | augment-context, deepwiki | design.md |
| R 研究 | context7 | superpowers (research) | augment-context, deepwiki | design.md (更新) |
| D 设计 | context7 | superpowers (writing-plans) | deepwiki | design.md (终稿) |
| P 规划 | plan-first | superpowers (writing-plans) | — | plan.md |
| E 开发 | tdd, code-quality, agent-teams | feature-dev, frontend-design, hookify | augment-context | doing.md |
| T 测试 | verification, e2e-testing | code-review, security-guidance | — | verified.md |
| V 验收 | smart-archive, knowledge | pr-review-toolkit, commit-commands | cunzhi | review.md |

## 阶段详情

---

### R₀b — 头脑风暴 (Path B+ only)

💡 **本阶段做什么**: 理解需求, 探索方案, 不写代码
🔧 **自动使用**: augment-context 扫描 → deepwiki 查库 → cunzhi 确认
⏭️ **下一阶段**: R (研究)

```
步骤:
1. augment-context-engine 搜索现有代码, 理解项目结构
2. 读 .knowledge/pitfalls.md — 避免重复犯错
3. 加载 skills/brainstorm — 苏格拉底式逐个提问
4. deepwiki 查候选技术库文档
5. 输出 2-3 方案到 .ai_state/design.md
6. cunzhi [DESIGN_DIRECTION] — 用户选择方向
```

---

### R — 研究

💡 **本阶段做什么**: 深入调研已选方案, 确认技术可行性
🔧 **自动使用**: context7 拉取库文档 → 对照 design.md 验证

```
步骤:
1. 加载 skills/context7 — 按需拉取相关库文档
2. 对照 design.md 验证方案可行性
3. 识别技术风险和依赖
4. 更新 design.md 中的技术细节
```

Path A 简化: 只做 augment-context 快速扫描, 不输出 design.md。

---

### D — 设计

💡 **本阶段做什么**: 确定技术方案, 输出架构决策
🔧 **自动使用**: context7 查 API 细节 → design.md 终稿 → cunzhi 确认

```
步骤:
1. context7 查 API 细节, 确认接口设计可行
2. 写入 .knowledge/decisions.md — ADR 记录
3. 完成 design.md 终稿
4. cunzhi [DESIGN_READY] — 用户确认设计
```

Path A 跳过。

---

### P — 规划

💡 **本阶段做什么**: 将设计拆解为可执行的任务列表
🔧 **自动使用**: plan-first 读 design.md → 生成 plan.md → cunzhi 确认

```
步骤:
1. 加载 skills/plan-first
2. 读 design.md 作为输入
3. 生成 .ai_state/plan.md: 任务列表 + 依赖 + 预估 + 分工
4. Path C+: 分配子代理 (builder/validator/e2e-runner)
5. cunzhi [PLAN_CONFIRMED] — 用户确认计划
```

Path A 跳过。Path B: /plan 生成轻量计划。

---

### E — 执行

💡 **本阶段做什么**: 按计划写代码, TDD 驱动
🔧 **自动使用**: tdd 分级 → code-quality 审查 → agent-teams 并行

```
步骤:
1. 加载 skills/tdd — 按 Path 分级:
   - Path A: 改了什么手动验证
   - Path B: 关键路径写测试
   - Path C+: 全覆盖 TDD
2. 逐个执行任务:
   - Path A: 直接开始开发 (无 plan.md)
   - Path B+: 按 plan.md 中的任务列表逐个执行
3. 每完成一个: doing.md 更新 TODO→DOING→DONE
4. Path C+: agent-teams 并行
   - builder 在 worktree 中实现
   - validator 在 worktree 中测试
   - explorer (background) 持续扫描依赖
5. 阶段性 cunzhi 确认 (每 3-5 个任务或关键里程碑)
```

---

### T — 测试

💡 **本阶段做什么**: 验证代码质量, 跑测试, 安全检查
🔧 **自动使用**: verification 分级清单 → e2e-testing → code-review plugin

```
步骤:
1. 加载 skills/verification — 按 Path 分级:
   - Path A: 功能验证 + lint
   - Path B: + 单测通过 + 类型检查
   - Path C+: + E2E + 安全审查 + 性能
2. Path B+: 触发 code-review plugin 自动审查
3. Path C+: 加载 skills/e2e-testing (Playwright)
4. Path C+: 加载 skills/security-review
5. 输出 .ai_state/verified.md
```

---

### V — 验收

💡 **本阶段做什么**: 最终确认, 提交, 归档经验
🔧 **自动使用**: delivery-gate hook → cunzhi 确认 → smart-archive

```
步骤:
1. delivery-gate.cjs 自动检查 (Stop hook):
   - plan.md 所有任务 DONE? (Path B+)
   - 测试通过?
   - lint 无错?
2. 加载 skills/code-quality — 最终审查
3. cunzhi [DELIVERY_CONFIRMED] — 用户确认交付
4. 触发 commit-commands plugin — 提交:
   - Path A: 单次 commit
   - Path B: squash merge
   - Path C+: 按功能分 commit
5. 加载 skills/knowledge — 沉淀经验到 .knowledge/
6. 加载 skills/smart-archive — 归档 .ai_state/ 到 archive/
```

## RIPER 阶段流转规则

- 只能前进, 不能跳过 (Path A 的"跳过"是路由决定, 不是运行时跳过)
- 每个阶段完成时更新 session.md 中的 `current_phase` 字段
- 中断恢复: context-loader.cjs 读 session.md 自动恢复到中断阶段
