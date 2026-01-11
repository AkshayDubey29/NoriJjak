# Disaster Recovery Playbooks

## 1. File Corruption / Repo Bad State
**Symptoms**: `pnpm integrity` fails, weird build errors, empty files.

**Recovery**:
1.  **Identify**: Run `pnpm integrity` to see which files are affected.
2.  **Restore**:
    - If git is healthy: `git checkout HEAD -- path/to/corrupt/file`
    - If multiple files: `git reset --hard HEAD`
    - If git is corrupt: Re-clone the repo.
    ```bash
    cd ..
    rm -rf NoriJjak
    git clone <repo-url> NoriJjak
    ```
3.  **Verify**: Run `pnpm integrity` again.

## 2. Database Corruption / Reset
**Symptoms**: Schema mismatch, unknown migrations applied, seed failure.

**Recovery**:
1.  **Reset Local DB**:
    This will DROP the database, apply all migrations from scratch, and run the seed script.
    ```bash
    cd apps/api
    pnpm db:reset
    ```
2.  **Verify**:
    ```bash
    pnpm prisma migrate status
    ```
    Should report "Database schema is up to date".

## 3. Lockfile / Dependency Drift
**Symptoms**: `pnpm install` fails, different versions installed.

**Recovery**:
1.  **Clean Install**:
    ```bash
    rm -rf node_modules
    rm -rf apps/*/node_modules
    rm -rf packages/*/node_modules
    pnpm install --frozen-lockfile
    ```
