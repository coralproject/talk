---
title: Experimental Plugin API
keywords: homepage
sidebar: talk_sidebar
permalink: plugins-experimental.html
summary:
---

Talk plugins are, in essence, small programs that hook into the core application in a variety of ways. Ultimately, this code can do anything that javascript is capable of. In addition, plugins can import any core code to hook into talk at any level.

If you want to write plugins that integrate with core code beyond the api described
in the client api or server api section, please keep the following things in mind:

* core code may change and break your plugin
* you may introduce inefficiencies with your plugin that could hurt performance/
crash Talk
* you may cause bugs in other areas of Talk

If you'd like to build a supported plugin but don't have the hooks you need,
please file an issue on this repo and we can discuss deepening the supported
plugin api!

With that said, if you are still undeterred, here are some of the prime
experimental integration points:

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
