#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

OUT_DIR="$ROOT_DIR/export"
mkdir -p "$OUT_DIR"
STAMP="$(date +%Y%m%d_%H%M%S)"
ZIP_PATH="$OUT_DIR/smart-construction-poc_bundle_${STAMP}.zip"

zip -r "$ZIP_PATH" \
  smart-construction-poc \
  scripts/run-smart-poc.js \
  scripts/bootstrap-smart-poc.sh \
  START_SMART_POC.bat \
  START_SMART_POC.sh \
  README.md \
  사이트_실행_가이드.md \
  파일_경로_정리.md \
  GITHUB_파일_클릭_경로.md \
  GITHUB_DESKTOP_설정_가이드.md \
  GITHUB_실행_가이드.md \
  PUBLISH_TO_GITHUB.md

echo "생성 완료: $ZIP_PATH"
