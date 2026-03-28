#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/4] 필수 도구 확인 중..."
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js가 설치되어 있지 않습니다. https://nodejs.org 에서 LTS 설치 후 다시 실행해 주세요."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm이 설치되어 있지 않습니다. Node.js 설치를 확인해 주세요."
  exit 1
fi
if ! command -v git >/dev/null 2>&1; then
  echo "❌ git이 설치되어 있지 않습니다. https://git-scm.com 에서 설치 후 다시 실행해 주세요."
  exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"
echo "✅ git: $(git --version)"

echo "[2/4] 루트 의존성 설치"
npm install

echo "[3/4] Smart 공사관리 PoC 의존성 설치"
npm --prefix smart-construction-poc install

echo "[4/4] 설치 검증 빌드"
npm --prefix smart-construction-poc run build

echo ""
echo "🎉 준비 완료! 아래 명령으로 실행하세요."
echo "npm run poc:start"
echo "접속: http://localhost:3000"
