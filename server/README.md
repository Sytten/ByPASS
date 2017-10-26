# Cartovelo Backend
The backend uses [NodeJs](https://nodejs.org/en/) and [Postgres](https://www.postgresql.org/).
We provide a **docker-compose** file for your convenience.

## Configuration
The backend needs access to a postgres database to work properly. To configure it, you will need to create a **config.json** file inside the config folder.
Please insert the following config (with your credentials) inside:

```
{
  "development": {
    "username": "root",
    "password": "password",
    "database": "bypass_development",
    "host": "localhost",
    "dialect": "postgres"
  }
}
```

## Run
- Install dependencies with [npm](https://www.npmjs.com/).
- Start the database `docker-compose run -d`
- Start the server using `node server.js`
