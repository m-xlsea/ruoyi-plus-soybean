---
name: codex-review
description: 对抗式计划审查 — P 阶段 CC↔Codex 多轮审查
---
# Codex Review (对抗式审查)

## 触发时机
P 阶段 plan.md 生成后, 如果 Codex 可用。

## 初始化
```
REVIEW_ID = 生成一个 8 位随机 ID (用 Bash: uuidgen | cut -c1-8)
```

## 审查模板选择
根据 design.md 关键词自动选择:
- 包含 API/endpoint/route → templates/api-review.md
- 包含 component/CSS/UI → templates/frontend-review.md
- 包含 deploy/docker/k8s/terraform → templates/infra-review.md
- 否则 → templates/general-review.md

## 对抗循环

### Round 1 (新 exec, 捕获 SESSION_ID):
CC → Codex:
  "审查以下计划. 严格找出漏洞/模糊/不可执行的部分.
   {plan.md 全文}
   {选定的 review template}
   结果以 VERDICT: APPROVED 或 VERDICT: REVISE 结尾."
Codex → 质疑列表 + VERDICT
如果 APPROVED → 结束, 记录到 reviews/review-{REVIEW_ID}.md
CC: 逐条评估 (采纳修改 plan / 驳回并说明理由)

### Round 2+ (resume SESSION_ID, 保持上下文):
CC → Codex (codex exec resume SESSION_ID):
  "修改后的计划差异: {diff}. 继续审查.
   VERDICT: APPROVED 或 VERDICT: REVISE."
Codex → 继续质疑 + VERDICT
...

## 终止条件 (满足任一)
a) Codex 返回 VERDICT: APPROVED
b) 连续 2 轮全部驳回 (记录分歧, cunzhi 让用户决策)
c) 超过 5 轮 (强制停止, 输出分歧摘要)

## 审查结果持久化
每次审查写入 `reviews/review-{REVIEW_ID}.md`:
```markdown
# Review {REVIEW_ID}
Date: {timestamp}
Rounds: {n}
Final Verdict: {APPROVED|STALEMATE|TIMEOUT}
## 采纳的修改
- ...
## 驳回的质疑
- ...
## 遗留分歧
- ...
```

## Fallback
如果 Codex 不可用:
  CC 用 validator agent 做 Plan Review:
  "作为严格审查者, 这个计划有哪些漏洞/模糊/不可执行的部分?"
