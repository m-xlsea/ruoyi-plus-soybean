# 编码规范 (rules.md)

## 通用

- 函数: 单一职责, <50 行, 清晰命名
- 错误处理: 不吞异常, 有意义的错误消息
- 注释: 解释 WHY 不解释 WHAT
- 不使用 any/as any (TS), 不使用 # type: ignore (Python)

## Git

- 分支: feature/{描述}, fix/{描述}, refactor/{描述}
- Commit: conventional commits (feat/fix/refactor/docs/test/chore)
- 每个逻辑变更独立 commit, 不混杂

## 测试

- 新功能必须有测试
- 修 bug 先写回归测试
- 覆盖率: 关键路径 100%, 整体 >80%

## 安全

- 不硬编码密钥/凭据
- 使用环境变量或 secret manager
- 所有用户输入必须验证/转义
