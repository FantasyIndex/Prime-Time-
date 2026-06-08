---
name: GitHub push config
description: How to push from this Replit workspace to the FantasyIndex/Prime-Time- GitHub repo
---

## Push command

```
GIT_ASKPASS=true git push https://<TOKEN>@github.com/FantasyIndex/Prime-Time-.git master:main
```

**Why:** Local branch is `master`; GitHub default branch is `main` — must always use `master:main` mapping or push will fail or go to wrong branch.

**How to apply:** Use this exact command for every GitHub push from this workspace.

- Token must be a **classic PAT** with the top-level `repo` scope checked
- Verify scopes before using: `curl -sI -H "Authorization: token <TOKEN>" https://api.github.com/user | grep x-oauth-scopes` — must show `repo` not empty
- Fine-grained tokens and tokens with no scopes will authenticate but return 403 on push
