<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" /></a>
</p>

## Description
Warehouse Internal System built with NestJS 

## Compile and run the project on development
```bash
# development / watch mode
$ npm install
$ npm start
$ cd frontend && npm install && npm start
```

## Create custom migration example
$ npm run migration:create

## Project setup on production
#### Run app on production with migration, build frontend, build backend and run backend
#### If next time you have some DB changes, run `npm run migration:generate` then next command
```bash
$ npm run build
```

#### After `npm run build` command open paths on browser
```
method is GET:
/api/translates/seed
/api/system-user/set-root
/api/rights/seed
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
