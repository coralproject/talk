# Frontend Architecture
## The Stack
 - [React](#react)
 - [Redux](#redux)
 - [ImmutableJS](#immutablejs)


## The Architecture
Our frontend lives within [talk/client](https://github.com/coralproject/talk/tree/153193959cb4dfa5d8feaabb49811325f836ee68/client) folder. Every folder contains a plugin. In [coral-framework](https://github.com/coralproject/talk/tree/153193959cb4dfa5d8feaabb49811325f836ee68/client/coral-framework) you will find the core architecture of Talk.
Here is where our Redux Application, translations, components, and helpers live.


## Presentational and Container Components
We use a common simple pattern called 
__Presentational and Container Components__

It basically consist in having two types of components: 
  - Presentational 
  - Containers

### Presentational Components
- __How our UI looks like__
- Are stateless components
- Render props
- Allow containment of children via `this.props.children`
- They have DOM Markup

### Container Components
* __How things work__
* They don’t have markup nor styles
* They provide data and behaviour to Presentational or Container Components
* They connect via `react-redux`’s `connect()` to the state.
* They `mapStateToProps` the state to the Presentational Container.
* They `mapDispatchToProps` to send actions to the Presentational Container.
* Name Convention `<Name>Container.js`

How a container looks like:
```js
/* 
* mapStateToProps
* We map the part of the state that we want to use
*/

const mapStateToProps = state => ({
  auth: state.auth.toJS()
});

/* 
* mapDispatchToProps
* We map the actions that we want to use
*/

const mapDispatchToProps = dispatch => ({
  checkLogin: () => dispatch(checkLogin())
});


/* 
* connect
* We wrap our container in a connect() function
*/

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInContainer);
````

How our SignInContainer works: [talk/SignInContainer.js · GitHub](https://github.com/coralproject/talk/blob/153193959cb4dfa5d8feaabb49811325f836ee68/client/coral-sign-in/containers/SignInContainer.js)

Within our plugins we create two folders `containers` and `components` so we can differentiate them:
```
coral-sign-in/
├── containers/
│   └── SignInContainer.js
└── components/
    ├── SignInContent.js
    └── SignUpContent.js
```

More about this architecture:

[Container Components – Learn React with chantastic – Medium](https://medium.com/@learnreact/container-components-c0e67432e005#.w8mzgndcg)


[Presentational and Container Components – Dan Abramov – Medium](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.ai4ih55v3)


## React
## Redux
We use Redux to handle the state container of Talk.

[How we to use Redux, and how we use it with Talk](https://github.com/coralproject/talk/blob/frontenddocs/docs/frontend/REDUX.md)


## ImmutableJS
We use Immutable JS to maintain our state immutable. 
We found some really good tradeoffs while building Talk.

[How to use ImmutableJS and how we use it with Talk](https://github.com/coralproject/talk/blob/frontenddocs/docs/frontend/IMMUTABLEJS.md)


## Test
[How we do testing at Coral with Talk](https://github.com/coralproject/talk/blob/frontenddocs/docs/frontend/DEBUG.md)


## Lint
For linting in Talk we use `eslint:recommended`

You can find more info about the rules and best practices here:
http://eslint.org/docs/rules/#best-practices

## Lint the code
```js
npm run lint
```


## The Future of the Frontend
- Preact
- Reselect
