# Club Model

The Club domain represents communities of players who play together regularly.

## Schema Definition (Prisma)

```prisma
model Club {
  id          String       @id @default(uuid())
  name        String
  description String?
  visibility  String       @default("PUBLIC") // PUBLIC, PRIVATE
  joinPolicy  String       @default("OPEN") // OPEN, APPROVAL, INVITE
  homeArea    String // Coarse area representation
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  sports      Sport[]      @relation("ClubSports")
  members     ClubMember[]
  games       Game[]
}

model ClubMember {
  id        String   @id @default(uuid())
  clubId    String
  club      Club     @relation(fields: [clubId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  role      String   @default("MEMBER") // OWNER, ADMIN, MEMBER
  status    String   @default("APPROVED") // REQUESTED, APPROVED, DENIED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([clubId, userId])
}
```

## Relationships
- **Sports**: Clubs support one or more sports (Many-to-Many).
- **Members**: Users can join clubs with specific roles.
- **Games**: Games can be optionally associated with a club.

## Membership Roles
- **OWNER**: Can delete the club, manage settings, and manage all members.
- **ADMIN**: Can manage membership requests and club details.
- **MEMBER**: Standard access to club-only features (future).

