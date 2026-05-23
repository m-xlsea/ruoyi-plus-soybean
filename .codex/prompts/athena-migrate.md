# /athena-migrate (Codex) — v9.5 → v9.6 迁移

参考 CC 版 `~/.claude/skills/athena-migrate/SKILL.md`. 算法一致 (因为 schema 跨平台相同, 这是铁律 6).

Codex 端差异:
- 用 python3 替代 node 生成 `_index.md` (Codex 默认有 python3)
- 检测 `cx_version` 写入 `platform_features.cx_version`, **不写** cc_version

## 备份脚本

```bash
mkdir -p .ai_state/.legacy-v9.5
cp -r .ai_state/{tasks.md,design.md,progress.md,lessons.md,handoff.md,project.json,reviews,hook-trace.jsonl} .ai_state/.legacy-v9.5/ 2>/dev/null || true
```

## 创建 details/

```bash
mkdir -p .ai_state/details/reviews .ai_state/details/tasks-archive
```

## 平移

```bash
[ -f .ai_state/tasks.md ] && mv .ai_state/tasks.md .ai_state/details/tasks-current.md
for f in design.md progress.md lessons.md handoff.md; do
  [ -f .ai_state/$f ] && mv .ai_state/$f .ai_state/details/$f
done
[ -d .ai_state/reviews ] && mv .ai_state/reviews .ai_state/details/reviews
[ -f .ai_state/compact-snapshot.json ] && rm .ai_state/compact-snapshot.json  # Codex 无 compact 也能有的旧文件
```

## 生成 _index.md (python3)

```bash
python3 << 'PY'
import json, os, re, sys

proj = {}
try:
    with open('.ai_state/.legacy-v9.5/project.json') as f:
        proj = json.load(f)
except FileNotFoundError:
    pass

def count_match(path, pattern):
    try:
        with open(path) as f:
            return len(re.findall(pattern, f.read(), re.MULTILINE))
    except FileNotFoundError:
        return 0

def last_section_line(path, head_prefix='## '):
    try:
        lines = open(path).read().split('\n')
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].startswith(head_prefix):
                return i + 1
    except FileNotFoundError:
        pass
    return 0

def last_nonempty_line(path):
    try:
        lines = open(path).read().split('\n')
        for i in range(len(lines) - 1, -1, -1):
            stripped = lines[i].strip()
            if stripped and not stripped.startswith('<!--') and not stripped.startswith('#'):
                return i + 1
    except FileNotFoundError:
        pass
    return 0

tasks_pending = count_match('.ai_state/details/tasks-current.md', r'^- \[ \]')
tasks_done    = count_match('.ai_state/details/tasks-current.md', r'^- \[x\]')
progress_n    = last_nonempty_line('.ai_state/details/progress.md')
lessons_lines = count_match('.ai_state/details/lessons.md', r'^## ')
latest_lesson_line = last_section_line('.ai_state/details/lessons.md')

reviews = []
try:
    reviews = [f for f in os.listdir('.ai_state/details/reviews') if re.match(r'^sprint-\d+\.md$', f)]
except FileNotFoundError:
    pass
reviews_count = len(reviews)
latest_review = ''
if reviews:
    latest_review = 'details/reviews/' + sorted(reviews, key=lambda f: int(re.search(r'\d+', f).group()))[-1]

content = f'''---
schema_version: "9.6"
athena_version: "9.6.0"
project:
  path: "{proj.get('path','')}"
  stage: "{proj.get('stage','')}"
  sprint: {proj.get('sprint', 0)}
  active_goal: ""
counts:
  tasks_pending: {tasks_pending}
  tasks_done: {tasks_done}
  tasks_blocked: 0
  lessons_lines: {lessons_lines}
  progress_entries: {progress_n}
  reviews_count: {reviews_count}
pointers:
  latest_progress: "{('details/progress.md#L' + str(progress_n)) if progress_n else ''}"
  latest_review: "{latest_review}"
  latest_lesson: "{('details/lessons.md#L' + str(latest_lesson_line)) if latest_lesson_line else ''}"
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
gotchas: {json.dumps(proj.get('gotchas', []))}
conventions: {json.dumps(proj.get('conventions', []))}
tech_stack: "{proj.get('tech_stack','')}"
test_cmd: "{proj.get('test_cmd','')}"
build_cmd: "{proj.get('build_cmd','')}"
lint_cmd: "{proj.get('lint_cmd','')}"
dev_cmd: "{proj.get('dev_cmd','')}"
---

# 项目状态索引 (v9.6 migrated from v9.5.5)

## 最近活动

## 当前阻塞

## 下一动作 (PACE 建议)

## 反思建议 (Hook 沉淀)
'''

with open('.ai_state/_index.md', 'w') as f:
    f.write(content)
print('[migrate] _index.md generated')
PY
```

## 收尾

```bash
touch .ai_state/details/next.md .ai_state/details/proposals.md
git add .ai_state/
git commit -m "athena: migrate state to v9.6 schema (codex)"
```
