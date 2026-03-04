---
name: quickstart
description: 新手引导流 — 首次使用或不知如何开始时
context: main
---

## 触发条件

1. vibe-init 检测到无 .ai_state/ 目录
2. 用户说"不知道怎么开始"、"怎么用"、"help"
3. 首次在项目中使用 VibeCoding

## 流程

1. **检测项目类型**
   - 有 package.json → Node.js 项目
   - 有 requirements.txt/pyproject.toml → Python
   - 有 go.mod → Go
   - 空目录 → 新项目, 问用户想做什么

2. **引导用户描述需求**
   ```
   👋 VibeCoding 已就绪！
   
   告诉我你想做什么, 比如:
   · "修复登录页面的样式问题"  → 我会快速修复 (Path A)
   · "给项目加个搜索功能"      → 我会完整规划再开发 (Path B)  
   · "重构整个认证系统"        → 我会拆分任务并行开发 (Path C)
   
   或者直接描述你的需求, 我来判断复杂度。
   ```

3. **展示执行计划预览**
   自动路由到 P.A.C.E., 展示计划, cunzhi 确认后开始。

## 设计原则
- 不暴露 VibeCoding 内部术语 (RIPER/P.A.C.E./Superpowers)
- 用户只需要说"做什么", 系统负责"怎么做"
- 提供具体示例, 降低认知门槛
