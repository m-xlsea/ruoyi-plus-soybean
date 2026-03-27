---
name: codex-comm
description: Codex CLI 通信层 — CC↔Codex 基础设施
---
# Codex Communication (通信层)

## 核心脚本
`.claude/skills/codex-comm/scripts/codex-bridge.cjs`

## 功能
1. **检测可用性**: `which codex` + health check (2s 超时)
2. **双模式**: exec (单轮) / serve (多轮 HTTP API)
3. **Session Resume**: `resumeSession(sessionId, prompt)` — 多轮对话保持上下文
4. **UUID 生成**: `generateReviewId()` — 并发安全, 防冲突
5. **敏感过滤**: .env / 密钥 → [REDACTED]
6. **自动降级**: Codex 不可用 → 输出提示, CC 独立执行

## 调用方式

### exec 模式 (简单, 单轮)
```javascript
const { execMode } = require('./scripts/codex-bridge.cjs');
const result = execMode("审查这段代码", { sandbox: 'read-only' });
```

### resume 模式 (多轮, 保持上下文)
```javascript
const { resumeSession } = require('./scripts/codex-bridge.cjs');
// 首次: execMode 返回 sessionId
// 后续: resumeSession(sessionId, "继续审查修改后的计划")
```

### serve 模式 (HTTP API, 最稳定)
```javascript
const { ensureServe, serveRequest } = require('./scripts/codex-bridge.cjs');
ensureServe(); // 自动启动如未运行
```

## Fallback
每个调用 Codex 的点都必须有:
```
如果 Codex 不可用:
  输出 "[VibeCoding] Codex 不可用, CC 独立执行"
  {CC 独立完成的替代逻辑}
```
