# Release Candidate Checklist

**Version**: 0.1.0-rc.1
**Date**: 2026-01-11

## Status Checks
- [ ] **API Integrity**: `pnpm integrity` passed.
- [ ] **Linting**: `pnpm lint` passed (all workspaces).
- [ ] **Unit Tests**: `pnpm test` passed.
- [ ] **Build**: `pnpm build` passed (Web + API).

## E2E Verification
- [ ] **Web E2E**: Playwright tests passed locally.
- [ ] **Mobile Build**: App builds successfully (`pnpm mobile:build`).
- [ ] **Mobile Runtime**: *Manual verify or known limitation (No Simulator).*

## Manual QA (Simulated)
- [ ] **Auth Flow**: Verified via Web E2E.
- [ ] **Game Flow**: Verified via Web E2E / Manual Walkthrough.

**Overall Status**: [ GO / NO-GO ]
