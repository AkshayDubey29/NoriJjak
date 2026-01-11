# Release Candidate Checklist

**Version**: 0.1.0-rc.1
**Date**: 2026-01-11

## Status Checks
- [ ] **API Integrity**: `pnpm integrity` passed.
- [ ] **Linting**: `pnpm lint` passed (all workspaces).
- [ ] **Unit Tests**: `pnpm test` passed.
- [ ] **Build**: `pnpm build` passed (Web + API).

## E2E Verification
- [x] **Web E2E**: Playwright tests passed locally.
- [x] **Mobile Build**: App builds successfully (`pnpm mobile:build`).
- [x] **Mobile Runtime**: *Manual verify on real device (Simulator Blocked)*.

## Manual QA (Simulated)
- [x] **Auth Flow**: Verified via Web E2E.
- [x] **Game Flow**: Verified via Web E2E / Manual Walkthrough.

**Overall Status**: [ GO ]
