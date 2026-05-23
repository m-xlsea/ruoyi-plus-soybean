#!/bin/bash
# Athena init.sh — 启动开发环境 + 基线测试
# 由 /athena-init 根据项目类型生成具体命令
set -e

echo "[Athena] 启动开发环境..."
# 示例 (根据项目类型):
# npm install
# pip install -e .
# cargo build

echo "[Athena] 运行基线测试..."
# npm test
# pytest
# cargo test

echo "[Athena] 就绪。"
