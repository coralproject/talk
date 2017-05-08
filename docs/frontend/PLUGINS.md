# Plugins
We can build plugins to extend the functionality of Talk.  

This guide is a walkthrough of our plugin architecture and components that we provide that allow you to build on top of Core coral components without having to understand the concepts there in. It is organized into three sections:

* Plugin architecture
* Using our building block components
* Styling

Advanced users will quickly realize that our plugins have complete access to core code. If you would like to write advanced plugins that reach outside of our published API as described in this document, please see [our notes on experimental pluginss](PLUGINS-experimental.md).

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

###  Components
We can add our components (or any other javascript code) within the `client` folder.

```
my-plugin/
  ├── client/
  │   ├── MyComponent.js
  │   └── index.js
  ├── server/
  └── index.js
```

####  Creating a Component
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

We are just creating a component that creates a `button`. Now that we created our component we need to specify where it should get injected within Talk!

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

### Styling our Plugin
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


### The server folder and the index file
Read more about the `/server` and how to extend Talk here.
[talk/PLUGINS.md at master · coralproject/talk · GitHub](https://github.com/coralproject/talk/blob/master/PLUGINS.md)
