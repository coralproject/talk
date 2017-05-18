import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import mainReducer from '../reducers';
import {client} from './client';

const apolloErrorReporter = () => (next) => (action) => {
  if (action.type === 'APOLLO_QUERY_ERROR') {
    console.error(action.error);
  }
  return next(action);
};

const middlewares = [
  applyMiddleware(
    client.middleware(),
    thunk,
    apolloErrorReporter,
  ),
];

if (window.devToolsExtension) {

  // we can't have the last argument of compose() be undefined
  middlewares.push(window.devToolsExtension());
}

let storeReducers = {
  ...mainReducer,
  apollo: client.reducer()
};

export const store = createStore(
  combineReducers(storeReducers),
  {},
  compose(...middlewares)
);

export default store;

export function injectReducers(reducers) {
  storeReducers = {...storeReducers, ...reducers};
  store.replaceReducer(combineReducers(storeReducers));
}

window.coralStore = store;
