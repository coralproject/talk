# Migrating to v4.1.0


## Database Migrations

We have unified the database verifications that were introduced in 3.x.x into
the migration system. This unification unfortunately required a database
migration bump.

### Source

When running via source, you can run the following to start the migration
process:

```bash
./bin/cli migration run
```
This will prompt you to perform a database backup before starting the migration
process. Data loss is entirely possible otherwise.


### Docker Compose

If you are running Talk with docker-compose, you can use the following command
to perform the migration:

```bash
docker-compose run --rm talk cli migration run
```
This will prompt you to perform a database backup before starting the migration
process. Data loss is entirely possible otherwise.


