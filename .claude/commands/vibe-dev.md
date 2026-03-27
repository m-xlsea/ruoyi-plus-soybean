---
name: vibe-dev
description: 启动开发工作流
---
# /vibe-dev $TASK

1. 初始化 .ai_state/ (如不存在, 从模板复制)
2. P.A.C.E. 路由 → 确定路径
3. 写入 .ai_state/session.md: 任务描述 + 路径 + 时间戳
4. 执行 RIPER-7 对应阶段

**注意**: 如果已有进行中的任务 (.ai_state/doing.md 有 [ ]), 先询问用户是否要切换任务。

等效于在会话中说 "开始开发: $TASK"
