# Database Migration Policy

## Principles
1.  **Migrations are the Source of Truth**: The database schema is defined by the committed history of migrations, not just the `schema.prisma` file.
2.  **No `db push` for Schema Changes**: `prisma db push` is strictly forbidden for applying schema changes in shared environments or for release. It bypasses migration history and causes drift.
3.  **Reproducibility**: Any developer or CI process must be able to recreate the database state exactly from scratch using `pnpm db:reset` (or `migrate reset`).

## Workflow
### 1. Development (Schema Changes)
When you need to change the schema:
1.  Modify `apps/api/prisma/schema.prisma`.
2.  Run `pnpm prisma migrate dev --name <descriptive_name>`.
    - This generates a SQL migration file in `prisma/migrations`.
    - It applies the migration to your local DB.
    - It updates the Prisma Client.
3.  Commit the new migration file and `schema.prisma`.

### 2. CI/CD & Deployment
- CI uses `pnpm prisma migrate deploy` to check if migrations can be applied.
- Production release applies pending migrations using `prisma migrate deploy`.

### 3. Prohibited Commands
- `prisma db push` (except for rapid prototyping on distinct local-only non-shared branches, but MUST be squashed into a migration before merge).

## Disaster Recovery / Reset
To reset your local database to a clean state:
```bash
cd apps/api
pnpm db:reset
```
This runs `prisma migrate reset`, which drops the DB, re-applies all migrations, and runs the seed script.
