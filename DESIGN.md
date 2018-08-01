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

1.  Tenant RedisPubSub Subscriber
2.  Tenant RedisPubSub Publisher
3.  Management RedisPubSub Subscriber
4.  Management RedisPubSub Publisher
