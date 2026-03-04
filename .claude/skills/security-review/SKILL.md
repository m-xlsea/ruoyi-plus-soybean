---
name: security-review
description: 安全审查清单 — T 阶段 (Path C+)
context: main
---

## 触发
Path C+ 的 T 阶段。

## 工具

| 工具 | 调用方式 |
|:---|:---|
| security-guidance | Plugin, 自然语言: "安全审查当前变更" |
| security-auditor agent | 子代理 (background), Path C+ 自动启动 |

## 检查项 (VibeCoding 补充)

- [ ] 无硬编码密钥/Token/密码
- [ ] SQL 查询使用参数化 (无字符串拼接)
- [ ] 用户输入已做 XSS 防护
- [ ] API 端点有认证/授权检查
- [ ] 敏感数据不出现在日志中
- [ ] 依赖无已知漏洞 (`npm audit`)

## 输出
cunzhi [SECURITY_PASSED] 确认后写入 verified.md。
