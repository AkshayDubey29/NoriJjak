# Build Troubleshooting

## Common Issues

### 1. Web Build Hangs
**Symptom**: `next build` hangs indefinitely at "Creating an optimized production build...".
**Cause**:
- Infinite loops in `useEffect` or static generation.
- Memory leaks in build process.
- Missing environment variables causing silent crashes in configuration.
**Fix**:
- Run with `NEXT_DEBUG_BUILD=true pnpm build` to see verbose logs.
- Check `next.config.mjs` for misconfiguration.
- Ensure `output: 'standalone'` is set if Dockerizing.

### 2. PostCSS / Tailwind Errors
**Symptom**: `Build failed because of webpack errors` ... `globals.css`.
**Cause**:
- `postcss-loader` failing to load config.
- `tailwindcss` version mismatch.
**Fix**:
- Ensure `postcss.config.js` exports a valid object.
- Try renaming `postcss.config.js` to `postcss.config.cjs` if using mixed modules.
- Check `package.json` for compatible versions.

### 3. Missing Dependencies
**Symptom**: `Module not found`.
**Fix**:
- Run `pnpm install` (or `pnpm install --force` if workspaces are desynced(
- Check `pnpm-workspace.yaml`.

## Performance Tips
- Use `pnpm -r build --filter ...` to build only what you need.
- Enable CI caching (see `CI_CACHING.md`).
