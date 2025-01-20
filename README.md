# Payments API
This project consists to manage payments, users, transactions, etc.

## Installation
Clone the project and install the dependencies:

```bash
# Clone the project
git clone https://github.com/yxd99/payment-gateway-bk.git

# Install project dependencies
npm i
```

## Run
Execute first the migrations and seed the database:
```bash
# Run migrations and seed the database
npm run migration:run && npm run seed
```

Now you can run the project in some of the following modes:

```bash
# In development mode:
npm run start:dev

# In production mode:
npm run start:prod
```

## Commands
This is the some of the commands available in the project.

| Command   | Description |
| --------- | ----------- |
| build     | Compiles the project for production. |
| start     | Start the server in development mode. |
| start:dev | Starts the server in development mode with supervision. |
| start:prod | Starts the server in production mode. |
| test:cov  | Run Jest to perform unit tests and generate code coverage. |


## Setup
The project uses a configuration file called example.env. This file contains the following variables:

| Category | Key | Value |
| --- | --- | --- |
| General | PORT | 3000 |
| General | NODE_ENV | development |
| Database | DB_USER | root |
| Database | DB_PASSWORD |  |
| Database | DB_HOST | 127.0.0.1 |
| Database | DB_PORT | 5432 |
| Database | DB_NAME | your_db_name |
| Database | DB_SCHEMA | public |
| API Payments | PAYMENT_API_URL | your_payment_api_url |
| API Payments | PAYMENT_API_PUBLIC_API_KEY | your_public_api_key |
| API Payments | PAYMENT_API_PRIVATE_API_KEY | your_private_api_key |
| API Payments | PAYMENT_API_SIGNATURE | your_signature |


You must copy the .env.example file and rename it to .env.

## Docker
The project includes a DockerCompose to create a Docker container. To create the container, run the following command:

```bash
docker up
```

## Documentation
The project has documentation made in swagger, to visualize it visit:

```bash
http://localhost:3000/api
```

## Unit Testing
It also has unit tests, uses `npm run test:cov` to generate the document and check the coverage.