![](hammyflip-banner.jpg)

<div align="center">
  <h1>Hammyflip Backend</h1>
</div>

## Overview

This is the Express.js backend code for [hammyflip.com](https://hammyflip.com/). The website uses devnet—mainnet is not available.

- **[Program code for Hammyflip](https://github.com/hammyflip/flipper-program)**
- **[Frontend code for Hammyflip](https://github.com/hammyflip/flipper-frontend)**

## Getting Started

First run `yarn` to install all packages.

Then, Ctrl-F for "REPLACE" and replace all instances.

Finally, run `yarn start` to start the server. After that, you should be able to go to http://localhost:4001/.

## Managing the Database

### Modifying the Database Schema

First, make your desired changes to `schema.prisma`.

Then, run something like the following:

```
DATABASE_URL="REPLACE" yarn prisma migrate dev --name MIGRATION_NAME_HERE
```

This will apply all DB migrations to the DB we use for local development.

### Inserting Into the Database

In order to insert into the DB used for local development, run:

```
DATABASE_URL="REPLACE" yarn prisma studio
```