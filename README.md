# flipper-api

## Getting started

First run `yarn` to install all packages.

Then, run `yarn start` to start the server. After that, you should be able to go to http://localhost:4000/.

## DB stuff

### Modifying the DB schema

First, make your desired changes to `schema.prisma`.

Then, run something like the following:

```
DATABASE_URL="postgres://hammy:8IDCJAsDOkuIIlihSvDyXq3Z25fCbAvf@dpg-cd8aocen6mpnkghpd490-a.oregon-postgres.render.com/hammyflip" yarn prisma migrate dev --name MIGRATION_NAME_HERE
```

This will apply all DB migrations to the DB we use for local development.

### Inserting into the DB

In order to insert into the DB used for local development, run:

```
DATABASE_URL="postgres://hammy:8IDCJAsDOkuIIlihSvDyXq3Z25fCbAvf@dpg-cd8aocen6mpnkghpd490-a.oregon-postgres.render.com/hammyflip" yarn prisma studio
```