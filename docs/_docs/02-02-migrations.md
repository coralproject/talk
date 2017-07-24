---
title: Database Migrations
permalink: /docs/running/migrations/
---

On major version changes, database migrations are usually required. The
application will refuse to start until all pending migrations are ran. This also
applies to empty databases.

## Running Migrations

We have a migration tool that can be run using `bin/cli migration run`. This
will detect new migrations available and prompt you to backup your database
before proceeding with the migration. Migrations are required with major version
releases.