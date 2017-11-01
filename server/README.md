# API
The backend uses:
[NodeJs](https://nodejs.org/en/)
[Postgres](https://www.postgresql.org/).

## Installation
- Change "trust" authentifcation by "md5" in file: `nano /usr/local/var/postgres/pg_hba.conf`
- Create a databse `createdb <databasename>`
- Add an user with password `psql postgres -c "CREATE ROLE <username> WITH LOGIN PASSWORD '<password>'"`
- Change password (maybe you need it for default password ;) `psql postgres -c "ALTER USER <username> PASSWORD '<newpassword>'"`
- Add database privileges to username `psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE <databasename> TO <username>"`
- Change owner of database `psql postgres -c "ALTER DATABASE <databasename> OWNER TO <username>"`

## Configuration
You will need to create **/config/config.json**.
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

## Run
- Install dependencies with `node install`
- Migrate database with  `sequelize db:migrate`
- Start the server using `nodemon server.js`

## Update + Security
### installation
npm install npm@latest -g
npm install -g npm-check-updates
npm i nsp -g
npm install -g snyk

### running commands
npm-check-updates -u
npm install
nsp check
snyk test
snyk wizard
