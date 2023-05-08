<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Create database server

https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-22-04

## Installation

```bash
$ yarn install
```

## Initialize database

```bash
# dev env
$ NODE_ENV=dev yarn run initDb
# prod env
$ NODE_ENV=prod yarn run initDb
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Environment variables

### dev env

Create env file: .env.dev in the root

```bash
PORT=4000
HOST='localhost'
JWT_SECRET='jwt-secret'
JWT_EXPIRES_IN=1
JWT_REFRESH_SECRET='jwt-refresh-secret'
JWT_REFRESH_EXPIRES_IN=2592000
ENCRYPTION_SECRET='encryption-secret'
SALT_OR_ROUND=10
MYSQL_URL="mysql://master4:zuj@2023@127.0.0.1:3306/zuj_db" # mysql://username:password@host:port/database_name
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USERNAME=master4
MYSQL_PASSWORD='zuj@2023'
MYSQL_DATABASE=zuj_db
MYSQL_SYCRONIZE=true

```

### e2e env

Create env file: .env.e2e in the root

```bash
PORT=4009
HOST='localhost'
JWT_SECRET='jwt-secret'
JWT_EXPIRES_IN=3600
JWT_REFRESH_SECRET='jwt-refresh-secret'
JWT_REFRESH_EXPIRES_IN=2592000
ENCRYPTION_SECRET='encryption-secret'
SALT_OR_ROUND=10
MYSQL_URL="mysql://master4:zuj@2023@127.0.0.1:3306/zuj_e2e" # mysql://username:password@host:port/database_name
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USERNAME=master4
MYSQL_PASSWORD='zuj@2023'
MYSQL_DATABASE=zuj_e2e
MYSQL_SYCRONIZE=true
MYSQL_DROP_SCHEMA=true
```

## APIs

### Get fixture calendar

```
[GET] /api/fixture/calendar?from=2023-05-01T00%3A00%3A00.000%2B07%3A00&to=2023-05-31T23%3A59%3A59.999%2B07%3A00

- Query (must be endcoded):
{
  "from": "2023-05-01T00:00:00.000+07:00",
  "to": "2023-05-31T23:59:59.999+07:00"
}

- Response:
{
  "url": "[GET] /api/fixture/calendar?from=2023-05-01T00%3A00%3A00.000%2B07%3A00&to=2023-05-31T23%3A59%3A59.999%2B07%3A00",
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": [
    "2023-05-04T02:00:00.000+07:00",
    "2023-05-04T02:00:00.000+07:00",
    "2023-05-11T02:00:00.000+07:00",
    "2023-05-11T02:00:00.000+07:00"
  ],
  "correlationId": "df672c2f-8577-42b5-9f9e-c47c592431eb",
  "timestamp": "2023-05-08T09:32:44.304+07:00",
  "took": "17 ms"
}
```

### Get fixtures

```
[GET] /api/fixture?type=filter&filter%5BkickoffTime%5D%5Bgte%5D=2023-05-04T00%3A00%3A00.000%2B07%3A00&filter%5BkickoffTime%5D%5Blte%5D=2023-05-04T23%3A59%3A59.999%2B07%3A00&skip=0&limit=1

- Query (must be encoded):
{
  "type": "filter",
  "filter": {
    "kickoffTime": {
      "gte": "2023-05-04T00:00:00.000+07:00",
      "lte": "2023-05-04T23:59:59.999+07:00"
    }
  },
  "skip": "0",
  "limit": "1"
}

- Response:
{
  "url": "[GET] /api/fixture?type=filter&filter%5BkickoffTime%5D%5Bgte%5D=2023-05-04T00%3A00%3A00.000%2B07%3A00&filter%5BkickoffTime%5D%5Blte%5D=2023-05-04T23%3A59%3A59.999%2B07%3A00&skip=0&limit=1",
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": [
    {
      "id": "78667739-e85c-45f6-831c-e43e4fd3d8be",
      "createdAt": "2023-05-08T02:32:43.190Z",
      "updatedAt": "2023-05-08T02:32:43.190Z",
      "tournamentId": "2862927d-7b05-4bc2-a3e0-850574d33717",
      "homeId": "5c6c77bf-2578-47aa-a6ab-887b0d176b86",
      "homeScore": 3,
      "awayId": "061a385a-1eef-40d5-ae81-3b5f363ec054",
      "awayScore": 2,
      "kickoffTime": "2023-05-03T19:00:00.000Z",
      "round": 13,
      "status": "finished",
      "tournament": {
        "id": "2862927d-7b05-4bc2-a3e0-850574d33717",
        "createdAt": "2023-05-08T02:32:42.997Z",
        "updatedAt": "2023-05-08T02:32:42.997Z",
        "name": "Europa League",
        "shortName": "EL",
        "region": "eu",
        "code": "el_eu",
        "logo": "https://upload.wikimedia.org/wikipedia/en/3/3e/Europa_League_logo_2010.svg"
      },
      "home": {
        "id": "5c6c77bf-2578-47aa-a6ab-887b0d176b86",
        "createdAt": "2023-05-08T02:32:43.087Z",
        "updatedAt": "2023-05-08T02:32:43.087Z",
        "name": "Borussia Monchengladbach",
        "shortName": "BMG",
        "logo": "https://upload.wikimedia.org/wikipedia/en/0/04/FC_Bayern_Munich_logo.svg",
        "region": "de"
      },
      "away": {
        "id": "061a385a-1eef-40d5-ae81-3b5f363ec054",
        "createdAt": "2023-05-08T02:32:43.084Z",
        "updatedAt": "2023-05-08T02:32:43.084Z",
        "name": "RB Leipzig",
        "shortName": "RBL",
        "logo": "https://upload.wikimedia.org/wikipedia/en/9/9c/Borussia_Dortmund_logo.svg",
        "region": "de"
      }
    }
  ],
  "correlationId": "4de8d9f2-c8bc-4f0a-9b11-d2899525ac5c",
  "timestamp": "2023-05-08T09:32:44.347+07:00",
  "took": "24 ms"
}
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
