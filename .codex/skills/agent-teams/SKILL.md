---
name: agent-teams
description: 多代理并行协作 — Path C/D 的 E 阶段
context: main
---
## 触发: Path C/D 的 E(执行) 阶段 (自动加载)

## 前提
- config.toml [features] multi_agent=true, collaboration_modes=true
- config.toml [agents] 定义了 builder/reviewer/explorer 角色
- plan.md 中任务已标注可并行/有依赖

## 编排策略
1. 读 plan.md → 识别无依赖的任务组
2. Codex 自动编排多代理 (基于 [agents] 角色定义)
3. spawn_agents_on_csv 可用于批量分派
4. 每个子代理独立工作, 完成后合并

## 并行规则
- 无依赖任务: 并行执行
- 有依赖任务: 串行, 前置完成后触发
- 同文件不并行修改
- 完成后 /review 审查合并结果

## 角色
builder: 先测试后实现, 限定范围, 每任务 commit
reviewer: 代码审查, 安全/正确性/测试风险
explorer: 只读调研, 搜索代码库/分析依赖
