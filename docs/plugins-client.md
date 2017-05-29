---
title: Client Plugin API
keywords: homepage
sidebar: talk_sidebar
permalink: plugins-client.html
summary:
---
We can build plugins to extend the client side functionality of Talk.  

The ultimate goal of our client side plugin architecture is to allow developers
to build on existing concepts without needing to understand core code while
providing complete power and flexibility of javascript, css and html.

* [Plugin Architecture](#plugin-architecture)
* Using our building block components
* [Reactions](#reactions)
* [Styling](#styling-plugins)

Advanced users will quickly realize that our plugins have complete access to core code. If you would like to write advanced plugins that reach outside of our published API as described in this document, please see [our notes on experimental plugins](/plugins/EXPERIMENTAL.md).

Under the hood our plugins are powered by *React*, *Redux* and *GraphQL*. We can also build them with simple vanilla javascript.

## Plugin Architecture

The plugins live in the `/plugins` folder. Each plugin must have an `index.js` file and two folders `client` and `server`.

### The Client Folder
The frontend of our plugin lives inside the `client` folder. The `client`  folder must have an `index.js` file that exports the configuration of our plugin.

```
my-plugin/
  ├── client/
  │   └── index.js <-- index for client side functionality
  ├── server/
  └── index.js <-- base plugin index
```

For now our base plugin `index.js` file should look like this:

```js
export default {
	// We will add more here later.
};
```

###  Creating a Component

We can add our components (or any other javascript code) within the `client` folder.

```
my-plugin/
  ├── client/
  │   ├── MyComponent.js
  │   └── index.js
  ├── server/
  └── index.js
```

Our component could look like this:

```js
import React, {Component} from 'react';

class MyButton extends Component {
  render() {
    return <button>My Button</button>;
  }
}

export default MyButton;
```

Here we create a component that renders a `button`. Now that we created our component we need to specify where it should get injected within Talk!

To tell Talk where that Component should get injected we need to specify which *Slots* to insert it into.

```js
import React from 'react';
export default = () => <button>My Button</button>;
```

### Slots
In Talk we have defined specific *Slots* where we can inject components.

Here is how we specify our slots config in `my-plugin/index.js`

```js
import MyButton from './MyButton';

export default {
  slots: {
    commentDetail: [MyButton]
  }
};
```

Here I’m specifying that the MyComponent Component will take place within the `commentDetail` in Talk.

`commentDetail` it’s a specific slot in the CommentStream. It means that it will be embedded inside de comment detail.

Slots properties take an`Array` so we can add as many components as we want.

## Building Blocks (TBD)

`Note: the concepts in this section are still to be implemented. Code samples are for discussion and may change.`

In order to allow you to build more complex plugins, we have wrapped some of our functionality in higher order components that expose a simple api.

## Reactions

Reactions provide users the ability to 'like', 'respect', etc... comments.

Note: some server side work will need to accompany this client side component. See the like and respect plugins as examples.

### Building Reactions

#### Our `client/index.js` :

```js
import LoveButton from './LoveButton';

export default {
  slots: {
    commentReactions: [LoveButton]
  }
};

```
In this example we add our reaction component to the `commentReaction` Slot

#### Our Reaction component:

```js
import React from 'react';
import {withReaction} from 'coral-plugin-api';

class LoveButton extends React.Component {
  handleClick = () => {
    const {
      postReaction,
      deleteReaction,
      alreadyReacted
    } = this.props;

    if (alreadyReacted()) {
      deleteReaction();
    } else {
      postReaction();
    }
  };

  render() {
    const {count} = this.props;
    return (
      <button onClick={this.handleClick}>
        <span>Love</span>
        <span>{count > 0 && count}</span>
      </button>
    );
  }
}

export default withReaction('love')(LoveButton);
```


This feature introduces `withReaction` HOC.  `withReaction` takes, as argument, a reaction string and it allows our component to receive specific props for handling reactions.

	* `postReaction` - Posts the reaction

	* `deleteReaction` - Removes the reaction

	* `alreadyReacted` - A function that returns a boolean.

	* `count` - The reaction count


For full reference: Please, check `coral-plugin-love`: [LoveButton.js](https://github.com/coralproject/talk/blob/master/plugins/coral-plugin-love/client/LoveButton.js)

### Comment Stream

Comment streams may be created with filtering and ordering in place:

* filter by user
* filter by tag
* sort by date ascending / descending

### Comment Commit hooks

// docs for the pre/post comment submit commit hooks

### Mod Queues

Moderation queues can be added via configuration objects passed in through plugins.

Basic mod queues will resemble the current moderation queues but can be generated from different lists of comments.

* filter by user tag
* filter by comment tag
* filter by comment status
* Custom queries (paired with back end plugins that provide queries to get the data)

#### Advanced mod queues

Advanced mod queues can be created giving plugin authors the power to create the cards that appear in the queue, create actions and custom buttons, etc...

### Custom Configuration

Plugins may rely on configuration options that admins/moderators can set in the Configuration section.

Basic settings can be added via json configuration in a plugin.

* Setting headline
* Setting description
* Setting input type
* Default value
* Variable name

#### Advanced Custom Configuration (low prioritiy)

Users can inject configuration interfaces that they create into the configuration allowing for more advanced configuration.


## Styling Plugins
Talk uses CSS Modules. This basically means that you can also add your CSS Module to your plugin without colliding with the rest of Talk!

##### My Component
```js
import styles from './style.css';

class MyCoralButton extends Component {
  render() {
    return <button className={styles.button}>My Button</button>;
  }
}
````

Our `style.css` should could look like this.
```css

.button {
	background: coral;
	border-radius: 3px;
}
```

## Plugin Hooks
The plugins injected in the CommentBox such as `commentInputDetailArea` will inherit through props tools for handling hooks.

### Available hook types:
`preSubmit` : To perform actions before submitting the comment.
`postSubmit` : To perform actions after submitting the comment.

### Register Hooks
`registerHook` is a function that takes: the hook type, a hook function and returns the hook data.

#### Usage:
```js
      this.addCommentTagHook = this.props.registerHook('postSubmit', (data) => {
        const {comment} = data.createComment;
        this.props.addCommentTag({
          id: comment.id,
          tag: 'OFF_TOPIC'
        });
      });
```

### Unregister Hooks

`unregisterHook` will remove the hook.

```js
	this.props.unregisterHook(this.addCommentTagHook);
```

### The server folder and the index file
Read more about the `/server` and how to extend Talk here.
[talk/PLUGINS.md at master · coralproject/talk · GitHub](https://github.com/coralproject/talk/blob/master/PLUGINS.md)

## ESlint and Babel
In talk we use `eslint:recommended` and Babel with the latest ECMAScript Features. But you can use your own!
While building your plugin you need to specify a `.eslintrc.json` file and a`.babelrc` file.

### `.eslintrc.json`
```json
{
  "env": {
    "browser": true,
    "es6": true,
    "mocha": true
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    }
  },
  "parser": "babel-eslint",
  "plugins": [
    "react"
  ],
  "rules": {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### `.babelrc `
```json
{
  "presets": [
    "es2015"
  ],
  "plugins": [
    "add-module-exports",
    "transform-class-properties",
    "transform-decorators-legacy",
    "transform-object-assign",
    "transform-object-rest-spread",
    "transform-async-to-generator",
    "transform-react-jsx"
  ]
}
```
