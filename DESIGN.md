# Design

## HTTP Routes

### Stream API

/api/tenant/graphql
/api/tenant/auth

### Tenant Management API

/api/management/graphql
/api/management/auth

## Folder structure

```text
/graph/tenant <-- tenant's api (comments, assets, ...)
/graph/management <-- tenant management api
```

1.  No tenants
2.  Create a tenant <-- consuming the TMA

## Database connections

### Redis Clients

1. Tenant RedisPubSub Subscriber *
2. Tenant RedisPubSub Publisher
3. Queue Subscriber *
4. Queue Publisher
5. Queue Client
6. Queue Blocking Client

## Scripts

### Embed

Embed Script - Renders the iFrame <-- does not have a html page in production (should be on server?)

/dist/static/assets/embed.js            /static/embed.js

### Stream

Stream       - Renders the comment stream <-- data

/dist/static/assets/stream.<HASH>.css   /static/assets/stream.<HASH>.css
/dist/static/assets/stream.<HASH>.js    /static/assets/stream.<HASH>.js
/dist/static/stream.html                /embed/stream

### Admin

Admin        - Renders the Admin page <-- data

/dist/static/assets/admin.<HASH>.css    /static/assets/admin.<HASH>.css
/dist/static/assets/admin.<HASH>.js     /static/assets/admin.<HASH>.js
/dist/static/admin.html                 /admin

## Development Routes

localhost:3000
    / -> /admin
    /dev <-- server side html for dev/iframe integration

localhost:8080
    / -> localhost:3000/dev
    /embed/stream <-- stream html (now is at /)
    /admin <-- stream html (now is not there)
