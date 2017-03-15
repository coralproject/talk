# Talk Plugins

Plugins for Talk can take various forms, currently we are only supporting server
side plugins.

## Plugin Registration: `plugins.json`

All plugins must be registered in the root file `plugins.json`.

The format for this file is thus:

```js
{
  "server": [
    "people"
  ]
}
```

Where we have a `server` key with an array of plugins that match the folder
name in the `plugins/` folder. For example, the above `plugins.json` would
require a plugin from `plugins/people`, which must provide a `index.js` file
that returns an object that matches the Plugin Specification.

## Server Plugins

### Specification

Each plugin should export a single object with all hooks available on it.

_**Note: You will have access to the whole core and other plugin's typeDefs,
context, loaders, mutators, resolvers, hooks. This is intentional, as it
encourages composing plugins to merge functionality, like a Slack plugin which
provides a Slack notify context function as well as having the loader for
comments.**_

The following are the hooks available:

#### Field: `typeDefs`

```graphql
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
```

Thanks to [gql-merge](https://www.npmjs.com/package/gql-merge) the contents of
`typeDefs` should be a string that will be _merged_ with the existing type
definitions. `enum`'s will be appended to, types will be appended, and new types
will be added.

#### Field: `context`

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

#### Field: `loaders`

```js
(context) => ({
  People: {
    load: () => db.people.find({user: context.user})
  }
})
```

Loaders should be provided as a function which returns a map which is used in
the resolvers function. These must return a promise or a value.

#### Field: `mutators`

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

#### Field: `resolvers`

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
[Apollo Docs](http://dev.apollodata.com/tools/graphql-tools/resolvers.html#Resolver-map).

This will merge with the existing resolvers in core and from previous plugins.

#### Field: `hooks`

```js
{
  RootMutation: {
    createPerson: {
      post(obj, args, {plugins: {Slack}}, person) {
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

### Full Example

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
        post(obj, args, {plugins: {Slack}}, person) {
          if (!person) {
            return person;
          }

          await Slack.notify(`A new person just was created with name ${person.name}`);

          return person;
        }
      }
    }
  }
};

```
