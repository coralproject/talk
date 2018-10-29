# Migrating from v3.x.x


## Deprecation Notices

It was previously recommended to use the user service function:

```js
Users.findOrCreateExternalUser(...);
```

If you are developing a social plugin, you should migrate this function to:

```js
Users.upsertSocialUser(...);
```

If you are developing an external auth integration (where the integration
provides) a custom displayName, you should migrate to:

```js
Users.upsertExternalUser(...);
```

## Troubleshooting Username Status

You may be affected by a side-effect of the above mentioned deprecated function
`Users.findOrCreateExternalUser(...);` if the following are true:

1. You have upgraded from Talk `< 3` to `>= 4` and have completed a database
  migration
2. You have used a custom auth plugin in the past
3. You have disabled or not included the `talk-plugin-auth` as a `client` plugin
4. You have received reports that some users can not comment, and are instead
  given a message `You are not authorized to perform this action.`

If this is the case, you can execute the following one time MongoDB query to
repair the affected users.

```js
db.users.update(
  {
    "status.username.status": {
      $in: ["UNSET", "CHANGED"]
    }
  },
  {
    $set: {
      "status.username.status": "SET"
    },
    $push: {
      "status.username.history": {
        status: "SET",
        assigned_by: null,
        created_at: ISODate()
      }
    }
  },
  {
    multi: true
  }
);

```

**Note: You must resolve and/or update your custom auth code to resolve the
above mentioned deprecation notices _before_ running the above mentioned MongoDB
query**
