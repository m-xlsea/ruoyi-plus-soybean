---
name: athena-status
description: >
  Athena 状态面板。显示当前 PACE 状态、Hook 触发计数、claude-mem 状态、plugin 健康。
effort: medium
disable-model-invocation: true
---

# /athena-status (v9.6)

实时聚合 Athena 运行状态。无副作用, 只读 (铁律 8 索引先行)。

## 收集顺序

### 1. PACE 状态 (从 _index.md frontmatter)
```bash
# 用 node 解析 YAML frontmatter
node -e '
const fs = require("fs");
const content = fs.readFileSync(".ai_state/_index.md","utf8");
const fm = content.match(/^---\n([\s\S]*?)\n---/);
if (!fm) { console.log("_index.md frontmatter 缺失"); process.exit(1); }
// 简化 YAML 解析: 仅读关键字段, 不引入 yaml 依赖
const get = (k) => { const m = fm[1].match(new RegExp("^  " + k + ": (.*)$","m")); return m ? m[1].replace(/^["\x27]|["\x27]$/g,"") : ""; };
console.log("Path:    ", get("path"));
console.log("Stage:   ", get("stage"));
console.log("Sprint:  ", get("sprint"));
console.log("Goal:    ", get("active_goal"));
'
```

### 2. Sprint 进度 (counts 段)
```bash
grep -E "^  (tasks_pending|tasks_done|tasks_blocked):" .ai_state/_index.md
```

### 3. Hook 触发记录 (最近 50 条)
```bash
tail -50 .ai_state/hook-trace.jsonl 2>/dev/null | \
  jq -r '.hook' 2>/dev/null | sort | uniq -c | sort -rn
```

按 hook 名分组统计:
- session-start: 注入次数
- index-updater: 更新次数
- pre-bash-guard: 拦截次数
- subagent-retry: 注入次数
- delivery-gate: 触发 (阻断/soft warn/pass)
- pace-continuator: 写入 next/proposals 次数
- compact-* : 注入次数
- state-audit: 漂移告警次数

### 4. Lessons 统计 (仅项目级)
```bash
grep "^  lessons_lines:" .ai_state/_index.md
grep "^## " .ai_state/details/lessons.md 2>/dev/null | tail -1
echo "[全局已删除, 跨项目记忆装 claude-mem]"
```

### 5. Platform 健康
```bash
grep "^  cc_version:" .ai_state/_index.md
grep "^  cx_version:" .ai_state/_index.md
grep -E "^  (goal|batch|background)_supported:" .ai_state/_index.md
grep "^  cross_session_memory:" .ai_state/_index.md
```

### 6. Plugin 状态
- codex: `which codex || codex --version 2>&1 | head -1`
- superpowers: `ls ~/.claude/plugins/cache/superpowers/ 2>/dev/null`
- claude-mem: `ls ~/.claude/plugins/ 2>/dev/null | grep -i claude-mem`
- context7: `npx ctx7 --version 2>&1 | head -1`

## 输出格式

```
=== VibeCoding Athena v9.6 Status ===

[PACE]    Path: Feature  Stage: impl  Sprint: 3
          Goal: tasks all checked + npm test exits 0

[Tasks]   3 done · 2 pending · 0 blocked
          Latest: details/progress.md#L46 (Task 5 done)

[Hooks]   最近 50 次触发:
  session-start     ✓ 5 注入
  index-updater     ✓ 28 更新
  delivery-gate     ✓ 12 (阻断 2, soft 1)
  pre-bash-guard    ✓ 0 拦截
  pace-continuator  ✓ 5 (next: 5, proposals: 2)
  subagent-retry    ⚠ 3 注入

[Lessons] 项目: 4 条 (最新: "JWT refresh secret 分离")
          [全局已删除, 跨项目记忆装 claude-mem]

[Platform]
  CC version           ✓ 2.1.140
  CX version           ✓ 0.130
  /goal               ✓ supported
  /batch              ✓ supported
  /background         ✓ supported
  Session memory      ✓ active
  Cross-session       ✓ claude-mem

[Plugins]
  codex@1.0.4         ✓ ready
  superpowers@5.x     ✓ loaded
  claude-mem          ✓ active
  context7            ✓ available

[Commands]
  test_cmd: npm test
  build_cmd: npm run build
  lint_cmd: npm run lint
```

## 实现方式

纯 Bash + node + jq. 失败的项显示 "✗ 不可用". 不写文件, 不改状态。
