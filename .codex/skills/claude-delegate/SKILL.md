---
name: claude-delegate
description: 接收 CC 派发任务 + 反向调用 CC
---
# Claude Delegate

## 当被 CC 调用时
- CC 通过 codex exec 发送任务
- 你在只读沙箱, 输出代码和建议
- 审查请求: 以 `VERDICT: APPROVED` 或 `VERDICT: REVISE` 结尾

## 反向调用 CC (独立运行时)
如需 Claude 视角:
```bash
# 如果有 claude CLI
claude -p "审查以下代码: {code}"
```
如不可用 → 用 validator agent 自审
