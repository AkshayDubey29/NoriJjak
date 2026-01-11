# Repo Integrity

To prevent repo corruption (e.g., from power failures, bad copies, or tool errors), we enforce integrity checks.

## Checks Performed
The script `ops/scripts/check-integrity.js` validates:

1.  **Critical Files**:
    - `package.json`
    - `pnpm-lock.yaml`
    - `pnpm-workspace.yaml`
    - `ops/manifest.json`
    - `.github/workflows/integrity.yml`
    - Must exist and be non-empty.

2.  **Required Directories**:
    - `prompts`, `reports`, `ops`, `infra`, `apps/api`, `apps/web`, `apps/mobile`, `packages/shared`.
    - Must detect complete monorepo structure.

3.  **Corruption Scanning**:
    - Scans all files (ignoring `node_modules`, `.git`, `dist`).
    - **Null Bytes**: Detects binary corruption in text files.
    - **JSON Validity**: Ensures all `.json` files can be parsed.

## How to Run
```bash
pnpm integrity
```

## Troubleshooting
If the check fails:
1.  Read the error output to identify the corrupt file.
2.  Restore the file from git history: `git checkout HEAD -- <file>`.
3.  If git is corrupt, re-clone the repository.
