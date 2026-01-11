# QA Playbook

## Overview
This playbook defines the manual verification steps required when automated E2E cannot be run (e.g., missing simulators) or for final sanity checks.

## Critical User Journeys

### 1. Authentication
- [ ] **Sign Up**: Register with new email -> Verifies DB creation & Token issue.
- [ ] **Login**: Login with existing -> Verifies Session.
- [ ] **Logout**: Clear session -> Redirect to Auth screen.

### 2. Core Loop (Games)
- [ ] **Create Game**: Post a new game -> Verify it appears in feed.
- [ ] **Join Game**: Open game detail -> Click Join -> Verify participant list updates.

### 3. Push Notifications (Mock)
- [ ] **Trigger**: Hit `/internal/send-push` endpoint.
- [ ] **Verify**: Check API logs for "Sending to X devices".

## Simulator/Emulator Setup (BLOCKED LOCALLY)
**Status**: The automated environment lacks Android/iOS Simulators.
**Action**: QA Owner must use their local machine or real device.

### Manual Mobile Verification
1.  **Build**: Run `pnpm mobile:build` to ensure type/lint safety.
2.  **Runtime**:
    - Connect real Android device via USB/Wifi.
    - Run `pnpm mobile:android`.
    - Verification:
        - [ ] App launches.
        - [ ] Login screen appears.
        - [ ] Login works.

