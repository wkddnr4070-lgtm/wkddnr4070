#!/usr/bin/env bash
set -euo pipefail

NEW_REPO_URL="https://github.com/wkddnr4070-lgtm/smart-construction-management-system.git"
TARGET_BRANCH="smart-construction-management-system"
BASE_BRANCH="main"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$NEW_REPO_URL"
else
  git remote add origin "$NEW_REPO_URL"
fi

git checkout -B "$TARGET_BRANCH"

echo "Remote: $NEW_REPO_URL"
echo "Base branch(참고): $BASE_BRANCH"
echo "Target branch: $TARGET_BRANCH"
echo "이제 push를 진행합니다..."
git push -u origin "$TARGET_BRANCH"
