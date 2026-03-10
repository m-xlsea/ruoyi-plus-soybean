---
name: agent-teams
description: 多代理并行协作 — Path C/D 的 E 阶段
context: main
---
## 触发: Path C/D 的 E(执行) 阶段

## 前提
- .claude/agents/ 目录下定义了 builder/validator/explorer 等子代理
- plan.md 中任务已标注可并行/有依赖

## 编排策略
1. 读 plan.md → 识别无依赖的任务组
2. 为每组分配 builder 子代理 (background: true)
3. 每个 builder 使用 isolation: worktree 隔离
4. validator 定期检查各 builder 产出
5. explorer 负责跨模块调研

## 并行规则
- 无依赖任务: 并行执行
- 有依赖任务: 串行, 前置完成后触发
- 冲突检测: 同文件不并行修改

## 子代理调用
- Task(builder): 开发任务
- Task(validator): 验证任务
- Task(explorer): 调研任务
- `claude agents` 查看运行状态
