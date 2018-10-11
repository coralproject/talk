# Server Plugin API

The server functionality of our plugin lives inside the `index.js` plugin folder
that exports the configuration of our plugin.

            my-plugin/
            ├── client/
            │   └── ... <-- client side plugin files
            └── index.js <-- base + server plugin index

## Hooks

Each plugin should export a single object with all hooks available on it.

_**Note: You will have access to the whole core and other plugin's typeDefs,
context, loaders, mutators, resolvers, hooks. This is intentional, as it
encourages composing plugins to merge functionality, like a Slack plugin which
provides a Slack notify context function as well as having the loader for
comments.**_

The following are the hooks available:

### typeDefs

```
enum COLOUR {
  RED
  BLUE
}

type Person {
  name: String!
  colour: COLOUR!
}

type RootMutation {
  createPerson(name: String!): Person
}

type RootQuery {
  people: [Person!]
}

type Subscription {
  leader: Person
}
```

Thanks to [gql-merge](https://www.npmjs.com/package/gql-merge) the contents of
`typeDefs` should be a string that will be _merged_ with the existing type
definitions. `enum`'s will be appended to, types will be appended, and new types
will be added.

### context

```js
{
  Slack: (context) => ({
    notify: (message) => {
      // return a promise after we're done sending notifications.
    }
  })
}
```

Any property provided here will be added to the context parameter available
inside all resolvers, loaders, mutators, and of course, other context based
plugins.

The top level item must accept a context for the request which it should use to
configure the context plugin before it would be mounted at `context.plugins`.
This plugin above would mount at: `context.plugins.Slack`, or, if you're using
[object destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), `{plugins: {Slack}}`.

### Sort

A special context hook, `Sort` will allow plugin authors to provide new
methods to sort data. An example is as follows:

```js
{
  Sort: () => ({
    Comments: { // <-- (1)
      likes: { // <-- (2)
        startCursor(ctx, nodes, {cursor}) { // <-- (3)
          return cursor != null ? cursor : 0;
        },
        endCursor(ctx, nodes, {cursor}) { // <-- (4)
          return nodes.length ? (cursor != null ? cursor : 0) + nodes.length : null;
        },
        sort(ctx, query, {cursor, sort}) { // <-- (5)
          if (cursor) {
            query = query.skip(cursor);
          }

          return query.sort({
            'action_counts.like': sort === 'DESC' ? -1 : 1,
            created_at: sort === 'DESC' ? -1 : 1,
          });
        },
      },
    },
  }),
}
```

This has a bunch of special features:

1. `Comments` is the name of the type being sorted, this is pluralized and
    capitalized.
2. `likes` is the `sortBy` field in lowercase.
3. `startCursor` will retrieve the start cursor based on the current set of
    nodes and the current cursor.
4. `endCursor` will retrieve the end cursor based on the current set of nodes
    and the current cursor.
5. `sort` will mutate the `query` to apply the sort operations.

All the `startCursor`, `endCursor`, and `sort` functions must be provided in
order for the sorting to apply properly.

### loaders

```js
(context) => ({
  People: {
    load: () => db.people.find({user: context.user})
  }
})
```

Loaders should be provided as a function which returns a map which is used in
the resolvers function. These must return a promise or a value.

### mutators

```js
(context) => ({
  People: {
    create: (name) => {
      return db.people.insert({user: context.user, name});
    }
  }
})
```

Mutators should be provided as a function which returns a map which is used in
the resolvers function. These must return a promise or a value.

### resolvers

```js
{
  Person: {
    name(obj, args, context) {
      return obj.name;
    },
    colour(obj, args, context) {
      // Bill likes the colour red, everyone else likes blue.
      return obj.name === 'bill' ? 'RED' : 'BLUE';
    }
  },
  RootQuery: {
    people(obj, args, {loaders: {People}}) {
      return People.load();
    }
  },
  RootMutation: {
    createPerson(obj, {name}, {mutators: {People}}) {
      return People.create(name);
    }
  }
}
```

Should return a resolver map as described in the
[Apollo Docs](http://dev.apollodata.com/tools/graphql-tools/resolvers#Resolver-map).

This will merge with the existing resolvers in core and from previous plugins.

### hooks

```js
{
  RootMutation: {
    createPerson: {
      post: async (obj, args, {plugins: {Slack}}, info, person) {
        if (!person) {
          return person;
        }

        await Slack.notify(`A new person just was created with name ${person.name}`);

        return person;
      }
    }
  }
}
```

Hooks here are pretty special, for each resolver field, you can specify a
pre/post hook that will execute pre and post field resolution.

If your post function accepts four parameters, then it can modify the field
result. It is *required* that the function resolves a promise (or returns) with
the modified value or simply the original if you didn't modify it.

### setupFunctions

```js
setupFunctions: {
  leader: (options, args) => ({
    leader: {
      filter: (person) => person.place === 1
    },
  }),
}
```

Setup functions allow you to create filters that control which pubsub.publish() events
send data to the client. If the type in question contains args, clients may subscribe using those arguments to further filter their subscription.

For more information, see the [Apollo Docs](https://github.com/apollographql/graphql-subscriptions).

### tokenUserNotFound

```js
tokenUserNotFound: async ({jwt, token}) => {
  let profile = await someExternalService(token);
  if (!profile) {
    return null;
  }

  let user = await UserModel.findOneAndUpdate({
    id: profile.id
  }, {
    id: profile.id,
    username: profile.username,
    lowercaseUsername: profile.username.toLowerCase(),
    roles: [],
    profiles: []
  }, {
    setDefaultsOnInsert: true,
    new: true,
    upsert: true
  });

  return user;
}
```

The `tokenUserNotFound` hook allows auth integrations to hook into the event
when a valid token is provided but a user can't be found in the database that
matches the provided id.

The function is async, and should return the user object that was created in the
database, or null if the user wasn't found. The `jwt` parameter of the object
is the unpacked token, while `token` is the original jwt token string.

### tags

The tags hook allows a plugin to define tags that are code controlled (added
or enabled by code). Below is an example pulled from the core off topic plugin
on how to create a hook for the `OFF_TOPIC` name:

```js
[
  {
    name: 'OFF_TOPIC',
    permissions: {
      public: true,
      self: true,
      roles: []
    },
    models: ['COMMENTS'],
    created_at: new Date()
  }
]
```

You can refer to `models/schema/tag.js` for the available schema to match when
creating models to enable/disable specific features.

### router

```js
(router) => {
  router.get('/api/v1/people', (req, res) => {
    res.json({people: [{name: 'Bob'}]});
  });
}
```

The Router hook allows you to create a function that accepts the base express
router where you can mount any amount of middleware/routes to do any form of
action needed by external applications.

### passport

```js
const FacebookStrategy = require('passport-facebook').Strategy;
const UsersService = require('services/users');
const {ValidateUserLogin, HandleAuthPopupCallback} = require('services/passport');

module.exports = {
  passport(passport) {
    passport.use(new FacebookStrategy({
      clientID: process.env.TALK_FACEBOOK_APP_ID,
      clientSecret: process.env.TALK_FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.TALK_ROOT_URL}/api/v1/auth/facebook/callback`,
      passReqToCallback: true,
      profileFields: ['id', 'displayName', 'picture.type(large)']
    }, async (req, accessToken, refreshToken, profile, done) => {

      let user;
      try {
        const { id, provider, displayName } = profile;
        user = await UsersService.upsertSocialUser(
          req.context,
          id,
          provider,
          displayName
        );
      } catch (err) {
        return done(err);
      }

      return ValidateUserLogin(profile, user, done);
    }));
  },
  router(router) {

    // Note that we have to import the passport instance here, it is
    // instantiated after all the strategies have been mounted.
    const {passport} = require('services/passport');

    /**
     * Facebook auth endpoint, this will redirect the user immediately to facebook
     * for authorization.
     */
    router.get('/facebook', passport.authenticate('facebook', {display: 'popup', authType: 'rerequest', scope: ['public_profile']}));

    /**
     * Facebook callback endpoint, this will send the user a html page designed to
     * send back the user credentials upon successful login.
     */
    router.get('/facebook/callback', (req, res, next) => {

      // Perform the facebook login flow and pass the data back through the opener.
      passport.authenticate('facebook', HandleAuthPopupCallback(req, res, next))(req, res, next);
    });
  }
};
```

### translations

```js
const path = require('path');

module.exports = {
  translations: path.join(__dirname, 'translations.yml'),
};
```

Where the `translations.yml` contains:

```
en:
  embedlink:
    copy: "Copy Permalink"
```

Which overrides the copy for the `embedlink.copy` template. You can
also provide other languages as well by using the correct language
prefix. 

When creating a plugin using this `translations` hook to override copy 
from another plugin, be sure to list it after the plugin it's overriding
in the `plugins.json` file. 

### websockets

```js
module.exports = {
  websockets: {
    onConnect: (connectionParams, connection) => {
      // Do something with the connection params or connection, like
      // logging it out, or incrementing a metric.
    },
    onDisconnect: (connection) => {
      // Do something with the connection params or connection, like
      // logging it out, or decrementing a metric.
    },
  },
}
```

This `websockets` hook can be used to attach methods to the
`onConnect` and `onDisconnect` events on a server. The intention for
this hook is to allow administrators instrument the active websocket
connections.

### schemaLevelResolveFunction

```js
module.exports = {
  schemaLevelResolveFunction: (root, args, ctx, info) => {
    // The GraphQL Operation Name. Example: CoralEmbedStream_Embed
    const name = info.operation.name !== null ? info.operation.name.value : null;
    // Maybe increment a metric based on the operation name...

    // You must _always_ return the root.
    return root;
  },
};
```

The `schemaLevelResolveFunction` provides a function that is attached
at the schema level, so that all queries that are made will go through. This
can be used to create a better view of the graph landscape by creating metrics
of resolved query names.

## Full Example

Contents of `plugins.json`:

```json
{
  "server": [
    "people"
  ]
}
```

Located in `plugins/people/index.js`:

```js
module.exports = {
  typeDefs: `
  enum COLOUR {
    RED
    BLUE
  }

  type Person {
    name: String!
    colour: COLOUR!
  }

  type RootMutation {
    createPerson(name: String!): Person
  }

  type RootQuery {
    people: [Person!]
  }

  type Subscription {
    leader: Person
  }
  `,
  context: {
    Slack: () => ({
      notify: (message) => {
        // return a promise after we're done sending notifications.
      }
    })
  },
  loaders: ({user}) => ({
    People: {
      load: () => db.people.find({user})
    }
  }),
  mutators: ({user}) => ({
    People: {
      create: (name) => {
        return db.people.insert({user, name});
      }
    }
  }),
  resolvers: {
    Person: {
      name(obj, args, context) {
        return obj.name;
      },
      colour(obj, args, context) {
        // Bill likes the colour red, everyone else likes blue.
        return obj.name === 'bill' ? 'RED' : 'BLUE';
      }
    },
    RootQuery: {
      people(obj, args, {loaders: {People}}) {
        return People.load();
      }
    },
    RootMutation: {
      createPerson(obj, {name}, {mutators: {People}}) {
        return People.create(name);
      }
    }
  },
  hooks: {
    RootMutation: {
      createPerson: {
        post: async (obj, args, {plugins: {Slack}}, info, person) => {
          if (!person) {
            return person;
          }

          await Slack.notify(`A new person just was created with name ${person.name}`);

          return person;
        }
      }
    }
  },
  setupFunctions: {
    leader: (options, args) => ({
      leader: {
        filter: (person) => person.place === 1
      }
    }
  }
};

```
