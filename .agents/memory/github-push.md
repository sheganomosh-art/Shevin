---
name: GitHub push token
description: Which env var to use for GitHub API pushes in this project
---

Use `GITHUB_PERSONAL_ACCESS_TOKEN` (classic ghp_ token with repo scope) for all GitHub Trees API pushes.
`GITHUB_TOKEN` is expired/invalid.

**Why:** GITHUB_TOKEN was rotated and not updated. Fine-grained PATs (github_pat_) need explicit per-repo write permissions which weren't granted.

**How to apply:** In all push scripts use `process.env.GITHUB_PERSONAL_ACCESS_TOKEN`.
