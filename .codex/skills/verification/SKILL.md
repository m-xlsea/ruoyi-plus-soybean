---
name: verification
description: 代码验证 — T 阶段
context: main
---
## 触发: T(测试) 阶段

## 检查清单
1. 所有测试通过 (自动检测测试命令)
2. lint 通过 (eslint/ruff/clippy)
3. 类型检查通过 (tsc/mypy/cargo check)
4. 无 TODO/FIXME 残留
5. .ai_state/conventions.md 规范符合

## Path 差异
- Path A: 检查 1 即可
- Path B: 检查 1-5 + 输出 verified.md
- Path C+: + 调用 validator 子代理

## 输出: .ai_state/verified.md (通过项目 + 发现问题)
