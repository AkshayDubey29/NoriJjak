# Local Infrastructure

This directory contains the Docker Compose configuration for local development.

## Services

- **Postgres**: Primary database.
  - Port: `5432`
  - User: `norijjak`
  - Password: `password`
  - DB: `norijjak`
- **Redis**: Caching and pub/sub service.
  - Port: `6379`

## How to run

Start the services in the background:
```bash
docker compose up -d
```

Stop the services:
```bash
docker compose down
```

View logs:
```bash
docker compose logs -f
```

