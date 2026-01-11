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

## Simulator/Emulator Setup
If simulators are available:
1. `pnpm mobile:ios` / `pnpm mobile:android`
2. Ensure API is running locally (`pnpm dev`).
