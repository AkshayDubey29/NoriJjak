# Git Workflow

## Branching Strategy
- **main**: Production-ready code. Protected. requires CI to pass.
- **develop**: Integration branch (optional, if team grows).
- **feature/**: Feature branches.
- **fix/**: Bug fix branches.

## Pull Requests
- All changes must go through PR.
- **Required Checks**:
    - integrity
    - lint
    - test
    - build (all apps)
- **Review**: At least 1 approval required.

## Pre-Push Guard Rails
To save CI time and catch issues early, we recommend using the local pre-push hook.

### Setup
```bash
# Register the hook (manual for now, or use husky if added later)
cp ops/scripts/pre-push.sh .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

### What it checks
- Repo Integrity (`pnpm integrity`)
- Linting (`pnpm lint`)
- Tests (`pnpm test`)

To bypass (emergency only): `git push --no-verify`
