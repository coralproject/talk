import {createStore as reduxCreateStore, combineReducers, applyMiddleware, compose} from 'redux';

export function createStore(reducers, middlewares = []) {
  const enhancers = [
    applyMiddleware(
      ...middlewares,
    ),
  ];

  if (window.devToolsExtension) {

    // we can't have the last argument of compose() be undefined
    enhancers.push(window.devToolsExtension());
  }

  return reduxCreateStore(
    combineReducers(reducers),
    {},
    compose(...enhancers)
  );
}
