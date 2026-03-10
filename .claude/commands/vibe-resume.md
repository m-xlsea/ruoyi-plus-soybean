---
name: vibe-resume
description: 从中断处恢复开发
---
## 执行步骤
1. 读 .ai_state/session.md → 恢复上下文
2. 检测断点阶段 (context-loader.cjs 已处理)
3. 告知用户当前状态和下一步
4. 继续执行

等效于: 读取 SessionStart hook 输出 + 提示恢复
