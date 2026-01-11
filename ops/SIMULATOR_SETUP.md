# Simulator Setup Status

**Date**: 2026-01-11
**Status**: BLOCKED (Environment Limitation)

## Diagnosis
The current execution environment does not have access to:
1.  **Android SDK**: `ANDROID_HOME` is unset, and `sdkmanager`/`emulator` tools are missing from `$PATH`.
2.  **Xcode**: Only Command Line Tools are present. Full Xcode (required for iOS Simulator) is not installed or not linked via `xcode-select`.

## Implication
- **Mobile E2E**: Cannot be run locally.
- **Mitigation**:
    - Mobile E2E tests are stubbed (Maestro YAMLs created but not executed).
    - Verification relies on `pnpm mobile:build` (TypeScript check) and manual QA on real devices by the owner.

## Future Resolution
To enable simulators, the host machine needs:
1.  [Android Studio](https://developer.android.com/studio) installed with standard SDK paths.
2.  [Xcode](https://developer.apple.com/xcode/) installed and active (`sudo xcode-select -s /Applications/Xcode.app/...`).
