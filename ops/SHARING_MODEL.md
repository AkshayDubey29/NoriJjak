# NoriJjak Sharing Model

## Shareable Artifacts

### 1. Game Detail
- **Target**: Both Public and Private games.
- **Format**: Localized message with game title, sport, time, place, and a deep link.
- **Example (KO)**: `[축구] 주말 풋살 경기\n시간: 2026. 1. 10. 오후 2:00\n장소: 강남구\n\n같이 경기해요! https://norijjak.app/games/123`

### 2. Private Game Invite
- **Target**: Potential participants for a private game.
- **Format**: Simple message with the 8-character invite code.
- **Example (KO)**: `[놀이짝] 비공개 경기 초대 코드입니다: A1B2C3D4\n\n앱에서 코드를 입력하고 참가하세요!`

## Sharing Mechanisms

### Mobile
- Uses `Share.share` from `react-native`, which opens the native OS share sheet (AirDrop, KakaoTalk, SMS, etc.).

### Web
- **Primary**: `navigator.share` (Web Share API) for mobile browsers and compatible desktop browsers.
- **Fallback**: Clipboard copy with alert notification.

## Privacy Considerations
- Public game links are discoverable by design.
- Private game links only lead to the detail view; joining still requires the invite code (which is shared separately or included in the private share template).
- Coarse location (homeArea) is shared, not precise GPS.

