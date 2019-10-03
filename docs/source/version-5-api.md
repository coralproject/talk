---
title: GraphQL API Overview
permalink: /v5/api/overview/
---

Our API is generally served via GraphQL at `/api/graphql` on your Coral installation. If you're running Coral locally, this would be https://localhost:8080/api/graphql.

You can enable the GraphiQL interface at https://localhost:3000/graphiql (Note the port number here is not 8080, this is because this route is directly served by the server, and not the webpack development server) when running in development to access a GraphQL playground to use with documentation provided in the sidebar on what edges are available to you. You can do this by setting `ENABLE_GRAPHIQL=true`. **(🚨 Note 🚨) we do not recommend using this in production environments as it disables many safety features used by the application**.

## Making your first request

To learn a bit about how to interact with Coral, we'll query for comments on a
page of Coral.

The GraphQL endpoint we have can be used with any HTTP client available, but our
examples below will use the common `curl` tool:

```sh
curl --request POST \
  --url "http://localhost:8080/api/graphql" \
  --header "content-type: application/json" \
  --data '{"query":"query GetComments($url: String!) {story(url: $url) { id metadata { title } url comments { nodes { id body author { id username } } } } }","variables":{"url":"http://localhost:8080/"},"operationName":"GetComments"}'
```

When you unpack that, it's really quite simple. We're executing a `POST` request
to the `/api/graphql` route of the local Talk server with the GraphQL
request we want to make. It's composed of the `query`, `variables`, and
`operationName`.

```graphql
query GetComments($url: String!) {
  story(url: $url) {
    metadata {
      title
    }
    url
    comments {
      nodes {
        body
        author {
          username
        }
      }
    }
  }
}
```

We are grabbing the asset with the specified `$url`, and grabbing it's title and the comments under it.

We can then also specify our variables to the query being executed (in this
case, the url for the page where we have comments on our local install of Coral):

```json
{
  "url": "http://localhost:8080/"
}
```

It's also sometimes common to have multiple queries within a query, which is
where the `operationName` comes into play, where we simply specify the named
query that we want to execute (in this case, `GetComments`).

To get a deeper understanding of GraphQL queries, read up on
[GraphQL Queries and Mutations](http://graphql.org/learn/queries/).

## Understanding the response

Once you completed the above GraphQL query with `curl`, you'll get a response
sort of like this:

```json
{
  "data": {
    "story": {
      "metadata": {
        "title": "Coral 5.0 – Embed Stream"
      },
      "url": "http://localhost:8080/",
      "comments": {
        "nodes": [
          {
            "body": "First comment!",
            "author": {
              "username": "wyatt.johnson"
            }
          }
        ]
      }
    }
  }
}
```

All of the parameters you requested should be available under the `data`
property. Any errors that you get would appear in a `errors` array at the top
level, like this:

```json
{
  "errors": [
    {
      "message": "The specified story URL does not exist in the permitted domains list.",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": ["story"],
      "extensions": {
        "code": "STORY_URL_NOT_PERMITTED",
        "id": "e255e860-d3ab-11e9-acdf-b9e9700f06fa",
        "type": "INVALID_REQUEST_ERROR",
        "message": "The specified story URL does not exist in the permitted domains list."
      }
    }
  ],
  "data": {
    "story": null
  }
}
```

You should know that any property that is marked with a `!` is considered
required, and non-nullable, which means you can always guarantee on it being
there in your request if there were no errors.

## Authorizing a request

Some queries you may notice seem to return an error of
`USER_NOT_ENTITLED`. It's likely the case that you are making a request to a
route that requires authorization. You can perform authorization a few ways in
Talk.

Essentially, you need to get access to a JWT token that you can use to authorize
your requests.

```sh
curl --request POST \
  --url http://localhost:3000/api/auth/local \
  --header 'content-type: application/json' \
  --data '{ "email": "${EMAIL}", "password": "${PASSWORD}"}'
```

Which returns a response similar to:

```json
{
  "token": "${TOKEN}"
}
```

Where `${EMAIL}` is the email address of an admin user, and `${PASSWORD}` is the password for that admin user. This will generate a short term token (valid for 90 days). To generate a long lived access token (or Personal Access Token), you have to exchange the token generated above to create a new long lived token:

```sh
curl --request POST \
  --url "http://localhost:3000/api/graphql" \
  --header 'authorization: Bearer ${TOKEN}' \
  --header 'content-type: application/json' \
  --data '{"query":"mutation CreateAccessToken { createToken(input: { clientMutationId: \"\", name: \"My PAT\" }) { signedToken }}","operationName":"CreateAccessToken"}'
```

Which returns a response similar to:

```json
{
  "data": {
    "createToken": {
      "signedToken": "${TOKEN}"
    }
  }
}
```

Where `${TOKEN}` in the request being from the previous set of login steps and returning a new `signedToken` as `${TOKEN}` which can be used instead of the previous `${TOKEN}` value in the below examples.

Once you have your access token, you can substitute it as `${TOKEN}` in your
`curl` request as follows:

### Bearer Token

```sh
curl --request POST \
  --url "http://localhost:8080/api/graphql" \
  --header "content-type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{"query":"query GetComments($url: String!) {story(url: $url) { id metadata { title } url comments { nodes { id body author { id username } } } } }","variables":{"url":"http://localhost:8080/"},"operationName":"GetComments"}'
```

### Cookie

```sh
curl --request POST \
  --url "http://localhost:8080/api/graphql" \
  --header "content-type: application/json" \
  --cookie "authorization=${TOKEN}"
  --data '{"query":"query GetComments($url: String!) {story(url: $url) { id metadata { title } url comments { nodes { id body author { id username } } } } }","variables":{"url":"http://localhost:8080/"},"operationName":"GetComments"}'
```

## Persisted Queries

You might see an error like `RAW_QUERY_NOT_AUTHORIZED`. This means that you attempted to use either no token, or a token from a user without admin privileges. In Coral, we whitelist the GraphQL mutations and queries that are performed by the applications for security reasons meaning that only admin users can make arbitrary queries against the GraphQL API.
