# Skedway Lite API · skedway-event-management
Laravel backend + Vite/React frontend for a simple room reservation system.

## Requirements (Local)
* Docker & Docker Compose

* Node.js 20+

* Composer 2+

``Ports used (local): API (nginx) 8080, Frontend 5173, Swagger 9090, MySQL 3307, Redis 6379.``

## ▶️ Run locally
```
git clone https://github.com/lucasmirandasoftwaretree/skedway-event-management.git
cd skedway-event-management
```

* Start containers

```docker compose up -d --build```

* Database migrate + seed

```docker compose exec backend php artisan migrate --seed```

## URLs
* API: http://localhost:8080/api

* Frontend (Vite dev server): http://localhost:5173

* Swagger UI: http://localhost:9090

## Optional (frontend)
```
# frontend/.env.local
   VITE_API_BASE_URL=http://localhost:8080/api
```

## Endpoints
```
GET    /api/rooms
GET    /api/users
GET    /api/reservations?room_id=&user_id=
POST   /api/reservations
DELETE /api/reservations/{id}
```

## 🖥️ Main access for Backend API (production)
http://18.190.31.202/api/rooms

## Rules
* Reservations cannot overlap in the same room

* All timestamps in UTC

* Inputs in ISO 8601

## Cache
* Reservations listing is cached in Redis for 60s

* Cache is invalidated on create and cancel

## 🧪Tests & Lint (Local)
```
# Tests
docker compose exec backend php vendor/bin/phpunit

# PHP style Lint
docker compose exec backend php vendor/bin/pint
```

## 🖥️ Frontend (Local)
The Vite dev server runs in a container on port 5173:
* http://localhost:5173

## 🖥️ Frontend (production)
* http://18.190.31.202/

## 🤖 CI (GitHub Actions)
Two workflows are used:

``` .github/workflows/backend.yml ```
* Boots ephemeral MySQL/Redis services

* Generates a CI-only .env from .env.example

* Installs Composer deps, generates app key, migrates

* Runs PHPUnit and Pint

``` .github/workflows/ci.yml ```
* Backend (Docker) job and Frontend (Node 20) job

* Frontend runs typecheck, lint, build

* Uploads frontend/dist as an artifact

## ☁️ AWS Free Tier Deployment
infrastructure:
* EC2: Ubuntu 22.04/24.04 (t2.micro / t3.micro)

* RDS MySQL 8.0: db.t4g.micro (free tier), non-public

Security Groups

* EC2 SG: allow 80/443 (HTTP/HTTPS) and 22 (SSH)

* RDS SG: allow 3306 only from the EC2 SG

##🧠 Technical decisions
* All times stored and compared in UTC

* Overlap detection within a transaction (locking)

* Redis cache keyed by filters for 60s

* Soft cancellation via canceled_at