# WoofWoof-backend

# Setup with docker compose

Run this to launch microservices and databases (in development)
```bash
docker compose -f docker-compose.dev.yml up --build -d
```

If you want to restart the containers after modifications run
```bash
docker compose -f docker-compose.dev.yml restart #microservice_name
```

If you want to delete all the microservices and databases
```bash
docker compose -f docker-compose.dev.yml down -v
```
! don't forget to add microservices to modify docker compose and a Dockerfile when you create ones
! also fill the .env file with credentials