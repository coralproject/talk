# Redux
Redux is a predictable state container for JavaScript apps.

To understand Redux we need to dive into a few concepts. 

- [Actions](#actions)
- [Action Creators](#actions)
- [Action Types](#actions)
- [Reducers](#reducers)
- [Stores](#store)

## The three principles
These are the three principles to build Redux applications. The following are specified in the Redux Documentation [Three Principles · Redux](http://redux.js.org/docs/introduction/ThreePrinciples.html)

### Single source of truth
The state of your whole application is stored in an object tree within a single store. We are going to represent the whole state of our application in a single Javascript Object.

### State is read-only
The only way to change the state is to emit an action, an object describing what happened.

### Changes are made with pure functions
To specify how the state tree is transformed by actions, you write pure reducers.

## Actions
Actions describe that something happened in our application. They are payloads of information that send data to your store. __They are the only source of information for the store.__

Here is an example:
```js 
const ADD_COMMENT = 'ADD_COMMENT';

{
  type: ADD_COMMENT,
  comment: 'This is my comment.'
}
```

Actions are JavaScript objects. Every action must have a `type` property that indicates the type of action being performed. Types should be defined as constants.  

Once an app becomes big enough,  you may want to move them into a separate module. We store them in a  `contants.js` file. [auth.js Constants](https://github.com/coralproject/talk/blob/153193959cb4dfa5d8feaabb49811325f836ee68/client/coral-framework/constants/auth.js)

```js
import { ADD_COMMENT, REMOVE_COMMENT } from './constants'
```

We can dispatch an action by using `dispatch()`. 

Our actions live within the `coral-framework/actions` folder. [talk/client/coral-framework/actions](https://github.com/coralproject/talk/tree/153193959cb4dfa5d8feaabb49811325f836ee68/client/coral-framework/actions)

More about Actions: [Actions · Redux](http://redux.js.org/docs/basics/Actions.html)

### Async Actions
For our async operations we dispatch three actions.

- `<ACTION_TYPE>_REQUEST`

- `<ACTION_TYPE>_SUCCESS`

- `<ACTION_TYPE>_FAILURE`

#### Request
We use the postfix `_REQUEST` to know that the resource is being requested.

#### Success
We use the postfix `_SUCCESS` to know that the resource response came back successfully.

#### Failure
We use the postfix `_FAILURE` to know that the resource request failed.

## Action Creators
Action Creators are functions that return actions. This makes it easier to use, portable and testable.

```js
function addComment(comment) {
  return {
    type: ADD_COMMENT,
    comment
  }
}
```

So we can later trigger those actions by using  `dispatch()`

```js
dispatch(addComment(comment))
dispatch(removeComment(comment.id))
```


## Dispatch Function
The `dispatch()` function can be accessed directly from the store as `store.dispatch()`, but more likely you'll access it using a helper like react-redux's`connect()`. 

We use `connect()`in our containers. More about this in Architecture.

## Reducers
With Actions we describe that something happened in our application. But we don’t specify how our state will be modified with this change. 

In a Reducer we will specify how the state of our application change when an action has been dispatched.

Here we also will want to specify the `initialState`

Before building reducers it’s important to that you:
	- Don’t mutate the state 
 	- Return the previous state in the default case.

Here is an example of an auth reducer:
```js
const initialState = {
  isLoading: false,
  loggedIn: false,
	user: null,
	error: ''
};

function auth (state = initialState, action) {
  switch (action.type) {
    case actions.CHECK_LOGIN_REQUEST:
      return Object.assign({}, state, {
        isLoading: true
      });
    case actions.CHECK_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false,
        loggedIn: true,
		  user: action.user,
		  error: ''
      });
    case actions.CHECK_LOGIN_FAILURE:
      return Object.assign({}, state, {
		  isLoading: false,
        error: action.error,
		  loggedIn: false,
		  user: null		
      }); 
    default:
      return state
  }
}
```

Notice that a reducer takes the `state` as first argument and when it’s not defined it returns the `initialState`. As a second argument it takes the `action`. We have our state and we have the action.  This is the time to specify how we modify the state.  

### Reducers using ImmutableJS
We are using ImmutableJS to maintain our app state. Here is a guide on how to use ImmutableJS.

This is how a simplified version of our [auth reducer](https://github.com/coralproject/talk/blob/153193959cb4dfa5d8feaabb49811325f836ee68/client/coral-framework/reducers/auth.js) looks like: 
```js
const initialState = Map({
  isLoading: false,
  loggedIn: false,
	user: null,
	error: ‘’
});

function auth (state = initialState, action) {
  switch (action.type) {
    case CHECK_LOGIN_REQUEST:
    	return state
      	.set('isLoading', true);
    case CHECK_LOGIN_SUCCESS:
    	return state
      	.set('isLoading', false)
      	.set('loggedIn', true)
      	.set('user', action.user)
      	.set('error', '');
      });
    case CHECK_LOGIN_FAILURE:
    	return state
      	.set('isLoading', false)
			.set('error', action.error)
			.set('loggedIn', false)
			.set('user', null)		
      }); 
    default:
      return state
  }
}
```

Looks cleaner, right? 

It’s pretty easy to follow. Here it says if a `CHECK_LOGIN_REQUEST` action has been dispatched set the `isLoading` from our state to `true`.  And we can show a tiny loader to let the user now we are requesting something to the server.

Our actions live within the `coral-framework/reducers` folder. [talk/client/coral-framework/reducers ](https://github.com/coralproject/talk/tree/153193959cb4dfa5d8feaabb49811325f836ee68/client/coral-framework/reducers)

More about Reducers: [Reducers · Redux](http://redux.js.org/docs/basics/Reducers.html)

And the last thing we need to see is the __Store__

### Store
 The `Store`  is what holds the application state. Here we can access and update the state.

It’s important to note that we will only have a single store in our application called `rootReducer` and we will use reducer composition instead of many stores.

Here is an example of how create a store with [createStore()](http://redux.js.org/docs/api/createStore.html)  using a reducer:
```js
import { createStore } from 'redux'
import authReducer from './auth'
let store = createStore(authReducer)
```

We do have a lot of stores so we will need to combine all our reducers with [combineReducers()](http://redux.js.org/docs/api/combineReducers.html) within a single store

```js
import {combineReducers} from 'redux';

import authReducer from './auth'
import configReducer from './config'
import userReducer from './user'

const rootReducer = combineReducers({
  authReducer,
  configReducer,
  userReducer
	...
});
```

More about Stores: [Store · Redux](http://redux.js.org/docs/basics/Store.html)

## Useful Resources
[Redux Documentation · Redux](http://redux.js.org/)
[Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)
[Usage with React · Redux](http://redux.js.org/docs/basics/UsageWithReact.html)
