# ByPASS Server
The backend uses [NodeJs](https://nodejs.org/en/) and [Postgres](https://www.postgresql.org/).
We provide a **docker-compose** file for your convenience.

## Installation
- Install Brew with `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)`
- Install sequelize with  `brew install sequelize-cli`

## Configuration
Add user and password to your postgres db.
The backend needs access to a postgres database to work properly. To configure it, you will need to create **/config/config.json**.
Those following must be inlude inside config.json:
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

### if you are not using docker-compose:
- Change "trust" authentifcation by "md5" in file: `nano /usr/local/var/postgres/pg_hba.conf`
- Create a databse `createdb <databasename>`
- Add an user with password `psql postgres -c "CREATE ROLE <username> WITH LOGIN PASSWORD '<password>'"`
- Change password (maybe you need it for default password ;) `psql postgres -c "ALTER USER <username> PASSWORD '<newpassword>'"`
- Add database privileges to username `psql postgres -c GRANT ALL PRIVILEGES ON DATABASE <databasename> TO <username>"`


## Run
- Install dependencies with `node install` (look at package.json)
- Migrate database with  `sequelize db:migrate`
- Start the database `docker-compose run -d`
- Start the server using `node server.js`
