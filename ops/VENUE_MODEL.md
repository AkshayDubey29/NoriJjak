# Venue Model

The Venue domain represents physical locations where sports games can take place.

## Schema Definition (Prisma)

```prisma
model Venue {
  id          String   @id @default(uuid())
  name        String
  area        String // e.g., "Seoul Gangnam-gu"
  address     String?
  category    String // e.g., "PUBLIC_PARK", "PRIVATE_CENTER", "SCHOOL"
  amenities   Json? // e.g., ["PARKING", "SHOWER", "RENTAL"]
  images      Json? // e.g., ["url1", "url2"]
  contact     String?
  mapLink     String?
  status      String   @default("ACTIVE") // ACTIVE, INACTIVE
  sports      Sport[]  @relation("VenueSports")
  games       Game[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Future Extensions
- **Partner Portal**: Venues will be "claimable" by owners to manage bookings.
- **Booking Integration**: Future steps will add a `Booking` model linked to `Venue` and `Game`.
- **Precise Location**: `lat` and `lng` fields can be added for map integration.
- **Verification**: `isVerified` flag for official partner venues.

