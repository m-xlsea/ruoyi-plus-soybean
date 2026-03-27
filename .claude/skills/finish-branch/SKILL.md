---
name: finish-branch
description: V 阶段分支收尾 — kaizen 之后, 交付确认之前
---
# Finish Branch (分支收尾)

## 触发时机
V 阶段 kaizen 完成后, cunzhi `DELIVERY_COMPLETE` 之前。

## 流程
1. 展示选项给用户:
   a) **merge**: 合并到主分支
   b) **pr**: 创建 Pull Request
   c) **keep**: 保留分支不动
   d) **discard**: 确认后删除分支

2. 如果选 **pr**:
   - 自动生成 PR description:
     ```
     ## 标题: {design.md 第一行}
     ## 摘要: {quality.md 总结}
     ## 变更列表:
     {plan.md 中已完成的 Task 列表}
     ## 测试: {quality.md 验证结果}
     ```
   - 执行: `gh pr create` 或输出文本供用户复制

3. 如果选 **merge**:
   - 检查是否有冲突: `git merge --no-commit --no-ff main`
   - 无冲突 → merge + 删除分支
   - 有冲突 → 输出冲突文件, 用户决定

4. 如果选 **discard**:
   - cunzhi 确认 "确定丢弃分支 {branch_name}?"
   - 确认后: `git checkout main && git branch -D {branch_name}`
