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

export function injectReducers(reducers) {
  const store = getStore();
  store.coralReducers = {...store.coralReducers, ...reducers};
  store.replaceReducer(combineReducers(store.coralReducers));
}

export function getStore() {
  if (window.coralStore) {
    return window.coralStore;
  }

  const coralReducers = {
    ...mainReducer,
    apollo: client.reducer()
  };

  window.coralStore = createStore(
    combineReducers(coralReducers),
    {},
    compose(...middlewares)
  );

  window.coralStore.coralReducers = coralReducers;

  return window.coralStore;
}
