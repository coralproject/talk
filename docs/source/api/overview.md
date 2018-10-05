---
title: GraphQL API Overview
permalink: /api/overview/
---

We provide all services that Talk can provide via the GraphQL API documented
on our [GraphQL API Reference](/talk/api/graphql/). If you've never heard
about GraphQL before, visit http://graphql.org/ to learn the basics first.

## Development

During development mode (when Talk has `NODE_ENV=development`) Talk will enable
the GraphiQL IDE at the following route:

    ${ROOT_URL}api/v1/graph/iql

This is pretty powerful, as it lets you explore the API documentation on the
sidebar as well as send off requests.

## Making your first request

To learn a bit about how to interact with Talk, we'll query for comments on a
page of Talk. I have Talk running locally, (If you don't and want to, checkout
our [Talk Quickstart](/talk/)).

The GraphQL endpoint we have can be used with any HTTP client available, but our
examples below will use the common `curl` tool:

```sh
curl --request POST \
  --url http://localhost:3000/api/v1/graph/ql \
  --header 'Content-Type: application/json' \
  --data '{"query":"query GetComments($url: String!) { asset(url: $url) { title url comments { nodes { body user { username } } } }}","variables":{"url":"http://localhost:3000/"},"operationName":"GetComments"}'
```

When you unpack that, it's really quite simple. We're executing a `POST` request
to the `/api/v1/graph/ql` route of the local Talk server with the GraphQL
request we want to make. It's composed of the `query`, `variables`, and
`operationName`.

```graphql
query GetComments($url: String!) {
  asset(url: $url) {
    title
    url
    comments {
      nodes {
        body
        user {
          username
        }
      }
    }
  }
}
```

The query itself is quite straightforward, we are grabbing the asset with the
specified `$url`, and grabbing it's title and the comments also (You can also
look at our [GraphQL API Reference](/talk/api/graphql/) for our entire schema).

We can then also specify our variables to the query being executed (in this
case, the url for the page where we have comments on our local install of Talk):

```json
{
    "url": "http://localhost:3000/"
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
    "asset": {
      "title": "Coral Talk",
      "url": "http://localhost:3000/",
      "comments": {
        "nodes": [
          {
            "body": "Second comment!",
            "user": {
              "username": "wyattjoh"
            }
          },
          {
            "body": "First comment!",
            "user": {
              "username": "wyattjoh"
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
  "data": {
    "asset": null
  },
  "errors": [
    {
      "message": "asset_url is invalid",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "asset"
      ]
    }
  ]
}
```

You should know that any property that is marked with a `!` is considered
required, and non-nullable, which means you can always guarantee on it being
there in your request if there were no errors.

## Authorizing a request

Some queries you may notice seem to return `null` or an error of
`NOT_AUTHORIZED`. It's likely the case that you are making a request to a
route that requires authorization. You can perform authorization a few ways in
Talk:

1. As a [Bearer Token](#bearer-token)
2. As a [Query Parameter](#query-parameter)
3. As a [Cookie](#cookie)

Essentially, you need to get access to a JWT token that you can use to authorize
your requests. Generating one is simple, you can use the CLI tools in Talk to do
that.

```sh
# first, find your user account
./bin/cli users list

# then, create a token for that account
./bin/cli token create ${USER_ID} example-token
```

Where `USER_ID` is the ID of your user account you found using the `users list`
command.

Once you have your access token, you can substitute it as `${TOKEN}` in your
`curl` request as follows:

### Bearer Token

```sh
curl --request POST \
  --url http://localhost:3000/api/v1/graph/ql \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer ${TOKEN}"
  --data '{"query":"query GetComments($url: String!) { asset(url: $url) { title url comments { nodes { body user { username } } } }}","variables":{"url":"http://localhost:3000/"},"operationName":"GetComments"}'
```

### Query Parameter

```sh
curl --request POST \
  --url http://localhost:3000/api/v1/graph/ql?access_token=${TOKEN} \
  --header 'Content-Type: application/json' \
  --data '{"query":"query GetComments($url: String!) { asset(url: $url) { title url comments { nodes { body user { username } } } }}","variables":{"url":"http://localhost:3000/"},"operationName":"GetComments"}'
```

### Cookie

```sh
curl --request POST \
  --url http://localhost:3000/api/v1/graph/ql \
  --header 'Content-Type: application/json' \
  --cookie "authorization=${TOKEN}"
  --data '{"query":"query GetComments($url: String!) { asset(url: $url) { title url comments { nodes { body user { username } } } }}","variables":{"url":"http://localhost:3000/"},"operationName":"GetComments"}'
```