# Tabelpress
#### An api base using tabel and express for building node.js apis on postgres

### Requirements
1. Node.js
2. Postgres. Install version 9.6 for best perf. Follow instructions from [here](https://serversforhackers.com/using-postgresql).
3. Redis. `sudo apt-get install redis-server`

### Setup
```bash
git clone git@github.com:fractaltech/tabelpress.git projectname
cd projectname
npm install
cp config.sample.js config.js
```
Now tweak config.js according to your needs.

### Server
- For Development: `npm run http.dev`
- Routes go in `app/routes`
- Filters go in `app/filters`
- Actions, or business logic, goes in `app/actions`
- For Production, sets env to production: `npm run http.forever`
- Stop Production server: `npm run forever.stop`

### Migrations
- `npm run migrate make MigrationName` -- creates a migration in `migrations` folder.
- `npm run migrate latest` -- migrate to latest migration
- `npm run migrate rollback` -- rollback last batch of migrations
- `npm run migrate reset` -- rollback all migrations
- `npm run migrate refresh` -- rollback all migrations, then run them again

Migrations documentation can be found [knex.js website](http://knexjs.org/#Schema)

### Tasks
- Have a look at `app/tasks/hello.js` for a blueprint of tasks. Each task **must** return a `Promise`.
- On adding a new task, hook it in via `app/tasks/index.js`.
- Run tasks via: `npm run task hello`
- You can also pass arguments. For ex. try this: `npm run task hello foo`
- Run task in production env: `npm run prod hello`

# Orm
- The default ORM provided is [**tabel**](https://github.com/fractaltech/tabel).
- Its a very simple ORM. It works with plain js objects and arrays, and offers relationship management.
- Define tables and relationships to be used with **tabel** in `app/orm/tables.js`
