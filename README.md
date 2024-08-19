## Explanation:
#### postgres Service:

- Uses the official PostgreSQL image.
- Exposes the PostgreSQL port 5432 to the host.
- The database is persisted using Docker volumes.


### Account Service:

- Builds the Docker image using the Dockerfile in the account-service directory.
- The DATABASE_URL environment variable is used to connect to the PostgreSQL database.
- The service depends on the postgres service to ensure PostgreSQL is running before the account manager starts.

### Payment Service:

- Builds the Docker image from the payment-manager directory.
- The DATABASE_URL is used because both services are using the same database.
- This service also depends on postgres.

Volumes:
- postgres-data: A volume is defined to persist the PostgreSQL data outside of the container.

## Build and Run the Services
- Now, you can build and run the services using Docker Compose:

`` docker-compose up --build ``

This command will:
- Build the Docker images for both microservices.
- Start the PostgreSQL database.
- Run both the Account Service and Payment Services.

## Accessing the Services
Once everything is running, you can access the services:

- Account Service: http://localhost:3000
- Payment Service: http://localhost:3001

## Stop the Services
To stop and remove the containers, you can run:

``` docker-compose down ```

This command stops the running containers and removes the containers, networks, and volumes created by docker-compose up.

## Documentation API
in here : https://documenter.getpostman.com/view/3108605/2sA3s9Eouo