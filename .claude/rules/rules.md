# VibeCoding 项目硬规则

## 代码规则 (从 skills 提取的强制规则)

1. 修 bug 必须写回归测试 (Path B+)
2. 新增 API 必须有入参验证
3. 数据库查询必须参数化, 禁止字符串拼接 SQL
4. 不提交 console.log/print 调试语句到生产代码
5. 环境变量不硬编码, 用 .env + process.env

## 工作流规则

6. 不在 E 阶段修改 design.md (设计已锁定)
7. plan.md 中未完成的任务不能标记为 DONE
8. .knowledge/ 文件不可删除, 只追加
9. conventions.md 变更需 cunzhi 确认
10. 每次 commit 必须关联 plan.md 任务编号 (Path B+)

## Git 规则

11. commit message 格式: `type(scope): description [T-XXX]`
12. Path B: squash merge 到主分支
13. Path C+: 按功能分 commit, 保留历史
