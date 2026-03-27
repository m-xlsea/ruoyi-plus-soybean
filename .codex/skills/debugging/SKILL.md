---
name: debugging
description: 系统化调试 4 阶段
---
# Systematic Debugging

必须按 4 阶段执行, 禁止跳步:

## 1. 复现 — 最小用例, 记录输入/期望/实际
## 2. 定位 — 从错误点向上追溯, 用证据不用直觉
## 3. 修复 — 只改根因, 有对应测试, 禁止 as any / 空 catch
## 4. 验证 — 复现通过 + 全量无回归 + Reflexion: 值得记录?
