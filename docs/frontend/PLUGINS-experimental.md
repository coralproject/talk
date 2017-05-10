# Experimental plugins

Talk plugins are, in essence, small programs that hook into the core application in a variety of ways. Ultimately, this code can do anything that javascript is capable of. In addition, plugins can import any core code to hook into talk at any level.

If you want to write plugins that integrate with core code beyond the api described in [PLUGINS.md](PLUGINS.md), please keep the following things in mind:

* core code may change and break your plugin
* you may introduce inefficiencies with your plugin that could hurt performance/crash Talk
* you may cause bugs in other areas of Talk

If you'd like to build a supported plugin but don't have the hooks you need, please file an issue on this repo and we can discuss deepening the supported plugin api!

With that said, here's some of the prime experimental integration points:

## Reducers and Actions : Redux

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

## Import Actions from Talk
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
