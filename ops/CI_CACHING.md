# CI Caching Strategy

To speed up builds in GitHub Actions, we utilize caching for dependencies and build artifacts.

## 1. pnpm Store Caching
**Goal**: Avoid re-downloading npm packages on every run.
**Implementation**:
- Use `actions/setup-node` with `cache: 'pnpm'`.
- This automatically handles hashing `pnpm-lock.yaml` and restoring `~/.local/share/pnpm/store`.

## 2. Next.js Build Cache
**Goal**: Reuse intermediate build outputs (like webpack cache) across runs.
**Implementation**:
- Cache `.next/cache` folder.
- Key based on `pnpm-lock.yaml` and source file hash (or simplified to branch name + fallback).

### Example Workflow Snippet
```yaml
- name: Cache Next.js build
  uses: actions/cache@v3
  with:
    path: |
      apps/web/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ hashFiles('apps/web/src/**') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-
```

## 3. Turbo/Nx (Future)
If we adopt TurboRepo, we can cache `node_modules/.cache/turbo` to skip tasks entirely.
