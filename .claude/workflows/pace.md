# P.A.C.E. 复杂度路由 v8.9

## 路由判定

分析用户输入, 按以下规则选择 Path:

| 信号 | Path A | Path B | Path C | Path D |
|:---|:---|:---|:---|:---|
| 文件数 | 1-2 | 3-10 | 10+ | 20+ |
| 预估时间 | ≤30 min | 6-12h | 1-3 周 | 3+ 周 |
| 关键词 | 修/改/加/删 | 做/实现/开发 | 重构/迁移/系统 | 架构/平台/全栈 |
| 描述长度 | ≤50 字 | 50-200 字 | 200+ 字 | 200+ 字+多模块 |
| 需求数 | 1 | 2-5 | 5-15 | 15+ |

> 不确定时: 问用户, 不猜。用 cunzhi 确认 Path 选择。

## 分级加载

### Path A — 敏捷 (≤30 min)

```
加载: CLAUDE.md + rules/rules.md
跳过: brainstorm, plan-first, agent-teams, security-review
RIPER 节点: R(轻) → E → T(轻) → V(cunzhi) → Done
状态文件: session.md + doing.md (最小集)
```

💡 **给新手**: 这是"改一行 CSS"、"修个 bug"、"加个字段"级别的任务。

### Path B — 协作 (6-12h)

```
加载: CLAUDE.md + rules + pace + riper-7 + 相关 skills
RIPER 节点: R₀b → R → D → P → E → T → V → Done
skills: brainstorm, context7, plan-first, tdd, verification, code-quality
确认点: [DESIGN_READY] [PLAN_CONFIRMED] [DELIVERY_CONFIRMED]
```

💡 **给新手**: 这是"做个登录功能"、"实现搜索"、"添加支付模块"级别。

### Path C — 系统 (1-3 周)

```
加载: 全量
RIPER 节点: 同 Path B + 并行分工
额外: agent-teams (worktree 隔离), e2e-testing, security-review
子代理: builder × N + validator + explorer (background)
确认点: 同 Path B + [SECURITY_PASSED]
```

💡 **给新手**: 这是"重构认证系统"、"数据库迁移"、"微服务拆分"级别。

### Path D — 长期 (3+ 周)

```
加载: 同 Path C
额外: 按周拆分里程碑, 每个里程碑 = 一个 Path B/C 子任务
看板: 里程碑级 kanban + 任务级 kanban
smart-archive: 每个里程碑归档一次
```

💡 **给新手**: 这是"从零搭建一个平台"、"全栈重写"级别。很少用到。

## 路由输出格式

选定 Path 后, 向用户展示:

```
📊 任务分析
├─ 复杂度: Path B (协作级)
├─ 预估: ~8 小时
├─ 文件涉及: ~6 个
├─ 关键技术: React + Supabase Auth
└─ 执行计划: R₀b(头脑风暴) → R(调研) → D(设计) → P(规划) → E(开发) → T(测试) → V(验收)

确认后开始？
```

然后调用 cunzhi 等待确认。
