# NoriJjak Deep Linking & Routing

## Link Formats

### Web
- **Game Detail**: `https://norijjak.app/games/:id`
- **Invite Redemption**: `https://norijjak.app/games/:id?invite=:token` (Proposed for unified detail view) or separate `/invites/:token`.
- **Notifications**: `https://norijjak.app/notifications`

### Mobile (Deep Links)
- **Scheme**: `norijjak://`
- **Game Detail**: `norijjak://games/:id`
- **Notifications**: `norijjak://notifications`
- **Onboarding**: `norijjak://onboarding`

## Routing Behavior

### Unauthenticated State
1. User clicks a link (e.g., `norijjak://games/123`).
2. App detects `!user` and shows `LoginScreen`.
3. After successful login, `user` state updates.
4. `NavigationContainer` with `linking` config automatically routes the user to the pending destination.

### Onboarding Gating
1. User is authenticated but `onboardingStep !== 'DONE'`.
2. App shows `OnboardingScreen`.
3. After onboarding completion, `user` state updates.
4. App switches to `Tab.Navigator`.
5. `NavigationContainer` routes user to the original destination.

## Implementation Details
- **Mobile**: Uses `expo-linking` and React Navigation `linking` prop.
- **Web**: Uses Next.js App Router. Gating is handled via `AuthContext` and route-level checks.

