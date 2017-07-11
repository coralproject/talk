---
title: GraphQL API
keywords: homepage
sidebar: talk_sidebar
permalink: /graphql-api.html
summary:
---

## GraphiQL

Explore the GraphQL API at

http://localhost:3000/api/v1/graph/iql

with the “Documentation Explorer” on the right side.


![GraphiQL screenshot](https://user-images.githubusercontent.com/815894/28073533-47debff6-6656-11e7-82fb-eb5aebefa350.png)





After logged-in as admin at admin/configure you are able to use GrapiQL to show admin/user data.



## First sample query
Me stands for the Admin Account

```
{
  me {
    id
    username
    created_at
    profiles {
      id
    }
    roles
    comments {
      hasNextPage
      startCursor
      endCursor
    }
    status
    reliable {
      flagger
      commenter
    }
  }
}
```
Response:

```
{
  "data": {
    "me": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "username": "micmac",
      "created_at": "Wed May 24 2017 10:01:33 GMT+0200 (CEST)",
      "profiles": [
        {
          "id": "macherey@gmx.net"
        }
      ],
      "roles": [
        "ADMIN"
      ],
      "comments": {
        "hasNextPage": false,
        "startCursor": null,
        "endCursor": null
      },
      "status": "ACTIVE",
      "reliable": {
        "flagger": true,
        "commenter": true
      }
    }
  }
}
```


## Find user ID`s

```
{
  users(query: {limit: 4}) {
    id
    username
    profiles {
      id
    }
    roles
  }
}
```

Response:

```
{
  "data": {
    "users": [
      {
        "id": "604dd0c9-e8a6-4565-8c42-e709d8403b51",
        "username": "micmacdev",
        "profiles": [
          {
            "id": "micmacdevac@gmail.com"
          }
        ],
        "roles": []
      },
      {
        "id": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "username": "micmac",
        "profiles": [
          {
            "id": "macherey@gmx.net"
          }
        ],
        "roles": [
          "ADMIN"
        ]
      }
    ]
  }
}
```

## User ID to query specific user
```
{
 user(id: "604dd0c9-e8a6–4565–8c42-e709d8403b51"){
  username
  id
  comments{
   nodes {
    id
    body   
   }
  }
 }
}
```
Response:

```
{
  "data": {
    "user": {
      "username": "micmacdev",
      "comments": {
        "nodes": [
          {
            "id": "eda2b9f0-3ac5-4adc-a680-1febac970298",
            "body": "But only for the Admin?"
          },
          {
            "id": "2ca510d0-2c15-4b89-95c6-d9a0e25b12ee",
            "body": "Time out?"
          },
          {
            "id": "fe95789d-e71a-403e-9338-6fcf82d7f89d",
            "body": "OSS is a great way to explore the software world!"
          },
          {
            "id": "255d115a-05a8-40a9-9e22-22d2e821ecc5",
            "body": "All you need is what you will get!"
          },
          {
            "id": "e067e3df-e7b9-4455-9d45-270c1f0adac8",
            "body": "A common way to use the commments, use Coral Talk. Michael"
          }
        ]
      }
    }
  }
}
```
