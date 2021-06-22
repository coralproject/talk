---
id: schema
title: Getting Started with the Coral API
sidebar_label: Coral API
description: Coral exposes a GraphQL API for performing administrative tasks.
---

The Coral API is a [GraphQL API](https://graphql.org/). A GraphQL API exposes
it's data as [structured object types](https://graphql.org/learn/schema/) and
enables developers to [write queries](https://graphql.org/learn/queries/) that
fetch only the specific data that they need for their application.

You can also explore the Coral API using the integrated [GraphiQL IDE](#graphiql-ide) on a
running instance of Coral.

## Requirements

- Applications must authenticate with an [access token](#get-an-access-token).
- Only administrative users can integrate with the API directly. **This means
  that the Coral API cannot be used for a native app integration which would
  require non-administrative users to interact with the API.**

## Quick Start

### Get an access token

Coral's GraphQL API requires you to generate an access token for authentication.
You can get an access token by using the [`coral-cli`](https://github.com/coralproject/coral-cli#coral-cli-tokencreate):

```bash
coral-cli token:create --domain "{{ CORAL_DOMAIN_NAME }}" --name "{{ accessTokenName }}" --json
```

Where `{{ CORAL_DOMAIN_NAME }}` is the domain name of the instance you're
authenticating to (including the scheme like `http://localhost:8080` if you're
using `http`). You should get a response containing a JSON payload with the
following structure:

```json
{
  "token": {
    "id": "00c125f6-ec9a-4fe9-9a72-89a34cce5e2e",
    "name": "test",
    "createdAt": "2021-02-23T19:52:22.993Z"
  },
  "signedToken": "eyJhbG...M31PJU"
}
```

The `signedToken` in the response should be used as the `{{ accessToken }}` when
making API requests to Coral's GraphQL API. Anyone using this token will be able
to do anything the user that created this token can, so keep this safe! This
token does not currently expire. You can list existing tokens using the
following:

```bash
coral-cli token:list --domain "{{ CORAL_DOMAIN_NAME }}" --json
```

You should get a response containing a JSON payload with the following
structure:

```json
[
  {
    "id": "00c125f6-ec9a-4fe9-9a72-89a34cce5e2e",
    "name": "test",
    "createdAt": "2021-02-23T19:52:22.993Z"
  }
]
```

You can revoke tokens using the following command:

```bash
coral-cli token:revoke --domain "{{ CORAL_DOMAIN_NAME }}" --id "{{ accessTokenID }}"
```

Where `{{ accessTokenID }}` is the `id` from the `token:create` or `token:list`
responses. This will mark the token as revoked and will prevent that token from
being accepted for future calls to the Coral GraphQL API.

### Make an API request

Once you have an access token, add it to the `Authorization` header when making
an API request:

```bash
curl --request POST \
  --url https://{{ CORAL_DOMAIN_NAME }}/api/graphql \
  --header "Authorization: Bearer {{ accessToken }}" \
  --header "Content-Type: application/json" \
  --data '{"query": "{ sites { nodes { name allowedOrigins } } }"}'
```

You should get back a response like:

```json
{
  "data": {
    "sites": {
      "nodes": [
        {
          "name": "News Site One",
          "allowedOrigins": ["https://news-site-one.com"]
        }
      ]
    }
  }
}
```

When using the Coral API in your application, you may want to use a client
library that [provides native support](https://graphql.org/code/) for GraphQL
APIs.

## GraphiQL IDE

It is not required to enable the `/graphiql` playground to use Coral’s GraphQL
API. The playground simply provides an easy way to explore and interact with
Coral’s GraphQL schema. You can enable the GraphiQL IDE interface at
[http://localhost:8080/graphiql](http://localhost:8080/graphiql) when running in
development. You can do this by adding:

```bash
ENABLE_GRAPHIQL=true
```

In your environment. **We do not recommend using this in production environments
as it will disable many security features used by the application!**

## Persisted Queries

You might see an error like `RAW_QUERY_NOT_AUTHORIZED`. This means that you
attempted to use either no token, or a token from a user without admin
privileges. In Coral, we whitelist the GraphQL mutations and queries that are
performed by the applications for security reasons meaning that only admin users
can make arbitrary queries against the GraphQL API.
