---
name: athena-migrate
description: >
  把 v9.5.5 项目的 .ai_state/ 升级到 v9.6 schema (INDEX + details/ 重构)。
effort: xhigh
disable-model-invocation: true
---

# /athena-migrate — v9.5.5 → v9.6 迁移

参考: <https://code.claude.com/docs/en/skills>

## 前置检查

```bash
test -d .ai_state || { echo "[migrate] 无 .ai_state, 请先 /athena-init"; exit 1; }
test -f .ai_state/_index.md && grep -q 'schema_version: "9.6"' .ai_state/_index.md && {
  echo "[migrate] 已是 v9.6 schema, 无需迁移"; exit 0;
}
```

## 迁移算法

### Step 1: 备份

```bash
mkdir -p .ai_state/.legacy-v9.5
cp -r .ai_state/{tasks.md,design.md,progress.md,lessons.md,handoff.md,project.json,reviews,hook-trace.jsonl,compact-snapshot.json} .ai_state/.legacy-v9.5/ 2>/dev/null || true
echo "[migrate] 旧文件已备份到 .ai_state/.legacy-v9.5/"
```

### Step 2: 创建 details/ 目录

```bash
mkdir -p .ai_state/details/reviews
mkdir -p .ai_state/details/tasks-archive
```

### Step 3: 迁移文件

| v9.5.5 路径 | v9.6 路径 | 备注 |
|---|---|---|
| `.ai_state/tasks.md` | `.ai_state/details/tasks-current.md` | 改名 |
| `.ai_state/design.md` | `.ai_state/details/design.md` | 平移 |
| `.ai_state/progress.md` | `.ai_state/details/progress.md` | 平移 |
| `.ai_state/lessons.md` | `.ai_state/details/lessons.md` | 平移 |
| `.ai_state/handoff.md` | `.ai_state/details/handoff.md` | 平移 |
| `.ai_state/reviews/sprint-N.md` | `.ai_state/details/reviews/sprint-N.md` | 平移 |
| `.ai_state/project.json` | (merge 到 _index.md frontmatter) | 转 markdown frontmatter |
| `.ai_state/hook-trace.jsonl` | `.ai_state/hook-trace.jsonl` | 保持原位置 |
| `.ai_state/compact-snapshot.json` | (删, v9.6 改写到 _index.md.snapshots) | 删除 |

```bash
# 平移
[ -f .ai_state/tasks.md ] && mv .ai_state/tasks.md .ai_state/details/tasks-current.md
for f in design.md progress.md lessons.md handoff.md; do
  [ -f .ai_state/$f ] && mv .ai_state/$f .ai_state/details/$f
done
[ -d .ai_state/reviews ] && mv .ai_state/reviews .ai_state/details/reviews
[ -f .ai_state/compact-snapshot.json ] && rm .ai_state/compact-snapshot.json
```

### Step 4: 生成 _index.md

从 `.ai_state/project.json` 读 path/stage/sprint/tech_stack/test_cmd/build_cmd/lint_cmd/dev_cmd/conventions/gotchas, 写入新 _index.md frontmatter。

```bash
# 用 node 脚本生成 _index.md (避免手写 yaml escape 出错)
node -e '
const fs = require("fs");
const path = require("path");

let proj = {};
try { proj = JSON.parse(fs.readFileSync(".ai_state/.legacy-v9.5/project.json","utf8")); } catch(e) {}

const sprint = proj.sprint || 0;

// 计算 counts
let tasks_pending = 0, tasks_done = 0, tasks_blocked = 0;
try {
  const t = fs.readFileSync(".ai_state/details/tasks-current.md","utf8");
  tasks_pending = (t.match(/^- \[ \]/gm) || []).length;
  tasks_done    = (t.match(/^- \[x\]/gm) || []).length;
} catch(e) {}

let progress_entries = 0, latest_progress = "";
try {
  const lines = fs.readFileSync(".ai_state/details/progress.md","utf8").split("\n").filter(l => l.trim().length > 0 && !l.startsWith("<!--") && !l.startsWith("#"));
  progress_entries = lines.length;
  if (lines.length > 0) latest_progress = `details/progress.md#L${lines.length}`;
} catch(e) {}

let lessons_lines = 0, latest_lesson = "";
try {
  const lines = fs.readFileSync(".ai_state/details/lessons.md","utf8").split("\n");
  lessons_lines = lines.filter(l => l.startsWith("##")).length;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].startsWith("## ")) { latest_lesson = `details/lessons.md#L${i+1}`; break; }
  }
} catch(e) {}

let reviews_count = 0, latest_review = "";
try {
  const files = fs.readdirSync(".ai_state/details/reviews").filter(f => f.startsWith("sprint-") && f.endsWith(".md"));
  reviews_count = files.length;
  if (files.length > 0) {
    const sorted = files.sort();
    latest_review = `details/reviews/${sorted[sorted.length-1]}`;
  }
} catch(e) {}

const idx = `---
schema_version: "9.6"
athena_version: "9.6.0"
project:
  path: "${proj.path || ""}"
  stage: "${proj.stage || ""}"
  sprint: ${sprint}
  active_goal: ""
counts:
  tasks_pending: ${tasks_pending}
  tasks_done: ${tasks_done}
  tasks_blocked: ${tasks_blocked}
  lessons_lines: ${lessons_lines}
  progress_entries: ${progress_entries}
  reviews_count: ${reviews_count}
pointers:
  latest_progress: "${latest_progress}"
  latest_review: "${latest_review}"
  latest_lesson: "${latest_lesson}"
  latest_proposal: ""
fingerprints:
  tasks_mtime: 0
  design_mtime: 0
  progress_mtime: 0
  lessons_mtime: 0
platform_features:
  cc_version: ""
  cx_version: ""
  goal_supported: false
  batch_supported: false
  background_supported: false
  session_memory_active: false
  cross_session_memory: "none"
gotchas: ${JSON.stringify(proj.gotchas || [])}
conventions: ${JSON.stringify(proj.conventions || [])}
tech_stack: "${proj.tech_stack || ""}"
test_cmd: "${proj.test_cmd || ""}"
build_cmd: "${proj.build_cmd || ""}"
lint_cmd: "${proj.lint_cmd || ""}"
dev_cmd: "${proj.dev_cmd || ""}"
---

# 项目状态索引 (v9.6 migrated from v9.5.5)

## 最近活动

## 当前阻塞

## 下一动作 (PACE 建议)

## 反思建议 (Hook 沉淀)
`;

fs.writeFileSync(".ai_state/_index.md", idx);
console.log("[migrate] _index.md generated");
'
```

### Step 5: 创建空 next.md 和 proposals.md

```bash
touch .ai_state/details/next.md
touch .ai_state/details/proposals.md
```

### Step 6: 平台版本检测填入 _index.md

调用 `/athena-setup --detect-only`, 它会原地更新 `_index.md.platform_features`。

### Step 7: 提示用户

```
✓ 迁移完成。备份在 .ai_state/.legacy-v9.5/, 确认无问题可删除。
新增的文件: .ai_state/details/next.md, .ai_state/details/proposals.md
删除的文件: .ai_state/project.json (合并到 _index.md frontmatter)
                .ai_state/compact-snapshot.json (改写到 _index.md.snapshots 数组)
下一步: /athena-status 查看新状态面板
```

### Step 8: Git commit

```bash
git add .ai_state/
git commit -m "athena: migrate state to v9.6 schema"
```

## 回滚 (如果出问题)

```bash
rm -rf .ai_state/details .ai_state/_index.md
cp -r .ai_state/.legacy-v9.5/* .ai_state/
```
