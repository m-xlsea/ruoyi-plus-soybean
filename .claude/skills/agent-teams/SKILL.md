---
name: agent-teams
description: 并行分工 + worktree 隔离 — Path C+
context: main
---

## 触发
P.A.C.E. 路由为 Path C/D 时激活。

## 子代理

| Agent | 文件 | 模型 | 隔离 | 角色 |
|:---|:---|:---|:---|:---|
| builder | agents/builder.md | sonnet-4-6 | worktree | 实现代码 |
| validator | agents/validator.md | sonnet-4-6 | worktree | 运行测试 |
| explorer | agents/explorer.md | sonnet-4-6 | background | 探索依赖 (只读) |
| e2e-runner | agents/e2e-runner.md | sonnet-4-6 | worktree | E2E 测试 |
| security-auditor | agents/security-auditor.md | sonnet-4-6 | background | 安全扫描 |

## Hooks 集成

- **TeammateIdle**: teammate 空闲时自动分配下一个 plan.md 任务
- **TaskCompleted**: teammate 完成后自动触发 validator 跑测试
- **WorktreeCreate**: worktree-init.cjs 初始化 .ai_state/

## 并行工作协议

1. 从 plan.md 读取任务列表, 标注依赖关系
2. 无依赖任务可并行分配给不同 builder
3. builder 完成 → TaskCompleted hook → validator 自动验证
4. validator 不通过 → 退回 builder 修复
5. 全部任务完成 → explorer 扫描集成点 → 主代理合并

## 降级
Agent Teams 不可用 → 顺序执行, 不并行。
