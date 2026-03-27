---
name: vibe-codex
description: 快捷调用 Codex
---
# /vibe-codex $INSTRUCTION

快捷方式: 直接调用 codex-comm skill 发送指令给 Codex。

1. 检测 Codex 可用性
2. 构建上下文 (git diff + 相关文件)
3. 过滤敏感信息
4. execMode(instruction, { sandbox: 'read-only' })
5. 展示 Codex 回复

如果 Codex 不可用 → 输出提示, 不执行。
