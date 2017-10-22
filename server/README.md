# Cartovelo Backend
The backend uses [NodeJs](https://nodejs.org/en/), [MySql](https://www.mysql.com/) and [AWS S3](https://aws.amazon.com/s3/).

## Configuration
The backend needs a mysql database to work properly. To configure it, you will need to create a **config.json** file inside the config folder.
Please insert the following config (with your credentials) inside:

```
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

The backend also need an endpoint and buckets to store images on AWS S3. That Configuration can be done inside the **s3.json** file inside the config folder.

Finally, the backend needs you to setup your IAM credentials on your computer to be able to access your S3 buckets. For more information please visit the [amazon documentation](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html).

## Run
- Install dependencies with [npm](https://www.npmjs.com/).
- Start the server using **server.js**
