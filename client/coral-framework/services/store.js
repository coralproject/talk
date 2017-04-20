import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import mainReducer from '../reducers';
import {client} from './client';

const apolloErrorReporter = () => next => action => {
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

const store = createStore(
  combineReducers({
    ...mainReducer,
    apollo: client.reducer()
  }),
  {},
  compose(...middlewares)
);

export default store;
window.coralStore = store;
