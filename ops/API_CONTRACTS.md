# NoriJjak Game API Contracts

## Games

### `POST /games`
Create a new match.
- **Request Body**: `CreateGameSchema` (sportId, venueId, title, visibility, joinPolicy, etc.)
- **Response**: `{ game: Game }`

### `GET /games`
List matches with filters and pagination.
- **Query Params**: `GameFilterSchema` (sportId, homeArea, status, visibility, cursor, limit)
- **Response**: `{ games: Game[], nextCursor: string | null }`

### `GET /games/:id`
Get game detail.
- **Response**: `{ game: Game }` (Includes `venue` object if attached)

### `POST /games/:id/join`
Join a match.
- **Request Body**: `{ inviteToken?: string }`
- **Response**: `{ message: string, participant: Participant }`

### `POST /games/:id/invites` (Host Only)
Generate an invite code for the game.
- **Request Body**: `{ maxUses?: number, expiresInHours?: number }`
- **Response**: `{ invite: GameInvite }`

### `POST /games/:id/participants/:participantId/:action` (Host Only)
Approve or deny a join request.
- **Path Params**: `action` (approve | deny)
- **Response**: `{ message: string }`

## Notifications

### `GET /notifications`
List current user's notifications.
- **Response**: `{ notifications: Notification[] }`

### `PUT /notifications/:id/read`
Mark a specific notification as read.
- **Response**: `{ notification: Notification }`

### `PUT /notifications/read-all`
Mark all notifications as read.
- **Response**: `{ message: string }`

## Venues

### `GET /venues`
List venues with filters and pagination.
- **Query Params**: `VenueFilterSchema` (sportId, area, query, cursor, limit)
- **Response**: `{ venues: Venue[], nextCursor: string | null }`

### `GET /venues/:id`
Get venue detail.
- **Response**: `{ venue: Venue }` (Includes `sports` and `_count.games`)

## Clubs

### `GET /clubs`
List clubs with filters and pagination.
- **Query Params**: `ClubFilterSchema` (sportId, homeArea, query, cursor, limit)
- **Response**: `{ clubs: Club[], nextCursor: string | null }`

### `POST /clubs`
Create a new club.
- **Request Body**: `CreateClubSchema` (name, homeArea, sportIds, visibility, joinPolicy)
- **Response**: `{ club: Club }`

### `GET /clubs/:id`
Get club detail.
- **Response**: `{ club: Club }` (Includes `sports`, `members`, `games`, and `_count.members`)

### `POST /clubs/:id/join`
Join a club.
- **Response**: `{ message: string, member: ClubMember }`

### `POST /clubs/:id/members/:memberId/:action` (Owner/Admin Only)
Approve or deny a club join request.
- **Path Params**: `action` (approve | deny)
- **Response**: `{ message: string }`

## Chat

### `GET /games/:id/chat`
List chat messages for a game.
- **Query Params**: `ChatMessageFilterSchema` (cursor, limit)
- **Response**: `{ messages: ChatMessage[], nextCursor: string | null }`

### `POST /games/:id/chat`
Send a chat message.
- **Request Body**: `SendChatMessageSchema` (body)
- **Response**: `{ chatMessage: ChatMessage }`

## Safety

### `POST /safety/block/:userId`
Block a user.
- **Response**: `{ message: string }`

### `POST /safety/unblock/:userId`
Unblock a user.
- **Response**: `{ message: string }`

### `POST /safety/reports`
Report a user, message, or rating.
- **Request Body**: `CreateReportSchema` (reportedId, messageId?, ratingId?, gameId?, reasonCode, note?)
- **Response**: `{ report: Report }`

## Ratings & Reputation

### `POST /ratings`
Create or update a rating for a user, venue, or club.
- **Request Body**: `CreateRatingSchema` (gameId?, targetUserId?, targetVenueId?, targetClubId?, score, comment?, categories?)
- **Response**: `{ rating: Rating }`

### `GET /ratings/summary/:type/:id`
Get reputation summary (average, count, badges).
- **Path Params**: `type` (user | venue | club), `id`
- **Response**: `{ average: number, count: number, badges: string[] }`

### `GET /ratings/:type/:id`
List recent ratings for an entity.
- **Path Params**: `type` (user | venue | club), `id`
- **Response**: `{ ratings: Rating[] }`
