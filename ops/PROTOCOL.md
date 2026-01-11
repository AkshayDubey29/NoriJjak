# NoriJjak Agent Protocol

This document defines the protocol for AI agents and IDEs working on the NoriJjak repository.

## Manifest-First Development

`ops/manifest.json` is the source of truth for the project state.

1. **Start of Step**: Before starting a new step (e.g., `STEP-0001`), update the manifest:
   - Set the step status to `IN_PROGRESS`.
   - Update `started_at` and `agent`.
2. **Execution**: Perform the tasks defined in the step prompt.
3. **End of Step**: After completion:
   - Update the manifest with artifacts and set status to `COMPLETED`.
   - Write a detailed report to `reports/STEP-XXXX.report.json`.

## Report Contract

Each step must produce a report in `reports/` following the schema defined in the step prompt. Reports must contain:
- Tech stack choices and major decisions.
- Commands run and their results.
- Automated test results.
- List of file changes.
- Acceptance checklist.

## Quality Gates

- Every step must ensure `lint`, `test`, and `build` pass at the root level.
- No hard-coded UI strings; all visible text must be localized in `packages/shared`.

