# Plugins
We can build plugins to extend the functionality of Talk.  Our plugins are powered by *React*, *Redux* and *GraphQL*. We can also build them with simple vanilla javascript. 
The plugins live in the `/plugins` folder. Each plugin must have an `index.js` file and two folders `client` and `server`.

Our plugin folder structure should look like this:
```
my-plugin/
  ├── client/
  ├── server/
  └── index.js
```


### The Client Folder
The frontend of our plugin lives inside the `client` folder. The `client`  folder must have an `index.js` file that exports the configuration of our plugin.

```
my-plugin/
  ├── client/
  │   └── index.js
  ├── server/
  └── index.js
```

For now our `index.js` file should look like this:

```js
export default {
	// We will add more here later.
};
```


###  Components
We can add our components within the `client` folder.

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
````

We are just creating a component that creates a `button`. Now that we created our component we need to specify where it should get injected within Talk!
To tell Talk where that Component should get injected we need to specify our *Slots*.

Also, our Component can be a Stateless Component.

```js
import React from 'react';
export default = () => <button>My Button</button>;
````

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

#### Reducers and Actions : Redux

Talk is powered by Redux and our plugins can too! Our plugins can have their own reducers and actions.

```js
import MyButton from './MyButton';
import reducer from './reducer';

export default {
  slots: {
    commentDetail: [MyButton],
  },
	reducer
};
```

### Import Actions from Talk
We can easily trigger `Talk` actions in our plugin Components.

```js
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addTag, removeTag} from 'coral-plugin-commentbox/actions';

class MyButton extends Component {
  render() {
    return <button onClick={this.props.addTag('MY_TAG')}>My Button</button>;
  }
}

const mapStateToProps = ({commentBox}) => ({commentBox});

const mapDispatchToProps = dispatch =>
  bindActionCreators({addTag, removeTag}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OffTopicCheckbox);
```

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

## ESlint and Babel
In talk we use `eslint:recommended` and Babel with the latest ECMAScript Features. But you can use your own! 
While building your plugin you need to specify a `.eslintrc.json` file and a`.babelrc` file.

#### `.eslintrc.json`
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
````


#### `. babelrc `
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
````

### The server folder and the index file
Read more about the `/server` and how to extend Talk here.
[talk/PLUGINS.md at master · coralproject/talk · GitHub](https://github.com/coralproject/talk/blob/master/PLUGINS.md)


