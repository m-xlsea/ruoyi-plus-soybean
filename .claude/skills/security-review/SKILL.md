---
name: security-review
description: 安全审查 — Path C+ 或显式触发
---
# Security Review

## 检查项
1. **认证/授权**: 每个端点是否有权限检查?
2. **输入验证**: 所有外部输入是否已验证和消毒?
3. **密钥管理**: 无硬编码, 用环境变量或密钥管理服务
4. **依赖**: `npm audit` / `pip audit` 无高危漏洞
5. **日志**: 不记录敏感信息 (密码/token/PII)
6. **CORS/CSP**: 如有 Web 接口, 是否配置正确?

## 产出
- 安全审查结果追加到 quality.md
