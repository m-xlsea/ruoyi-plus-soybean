---
name: kaizen
description: V 阶段持续改进回顾
---
# Kaizen (V 阶段回顾)

## 流程
1. 回顾本次开发:
   - 哪些做得好? (保持)
   - 哪些做得差? (改进)
   - 有没有反复出现的模式性错误?

2. 更新 .ai_state/lessons.md:
   - 新发现的技术陷阱
   - 有效的解决模式
   - 项目特有的约定

3. 更新 .ai_state/conventions.md "## Agent 易犯错误" 段:
   - 如果 Reflexion/Review 中发现了模式性错误
   - 格式: `- "具体错误描述 + 正确做法"`
   - 这些错误会在 SessionStart 时由 context-loader 输出提醒

4. 产出摘要给用户
