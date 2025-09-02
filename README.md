# skedway-event-management

# Skedway Lite API

## Requisitos
Docker, Docker Compose, Node 20, Composer 2

## Subir ambiente
docker compose up -d --build
docker compose exec backend php artisan migrate --seed

## Endpoints
GET /api/rooms
GET /api/users
GET /api/reservations?room_id=&user_id=
POST /api/reservations
DELETE /api/reservations/{id}

## Regras
Reservas não se sobrepõem na mesma sala. Horários em UTC, entradas ISO 8601.

## Cache
Listagem de reservas com cache Redis por 60s. Invalidação em criação e cancelamento.

## Testes
docker compose exec backend php vendor/bin/phpunit

## Lint
docker compose exec backend php vendor/bin/pint

## Swagger
http://localhost:9090

## Front-end
http://localhost:5173

## Decisões
Armazenamento UTC, checagem de conflito com lock transacional, cache por chave derivada de filtros, cancelamento lógico com canceled_at.

