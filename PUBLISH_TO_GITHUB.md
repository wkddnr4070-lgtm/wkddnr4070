# 저장소 코드 업로드 가이드

대상 저장소:
- `https://github.com/wkddnr4070-lgtm/smart-construction-management-system`

현재 환경에서는 GitHub 인증 정보가 없어 자동 push가 실패할 수 있습니다.

## 1) 원격 저장소 등록
```bash
git remote add origin https://github.com/wkddnr4070-lgtm/smart-construction-management-system.git
```

## 2) 현재 브랜치 push
```bash
git push -u origin work
```

## 3) 인증 오류가 나면 (PAT 사용)

```bash
git remote set-url origin https://<GITHUB_USERNAME>:<PERSONAL_ACCESS_TOKEN>@github.com/wkddnr4070-lgtm/smart-construction-management-system.git
git push -u origin work
```

> 보안상 PAT는 커밋/문서에 그대로 남기지 말고, 1회 push 후 URL을 원복하세요.
