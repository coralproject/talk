import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import mainReducer from '../reducers';
import {client} from './client';

const middlewares = [
  applyMiddleware(client.middleware()),
  applyMiddleware(thunk)
];

if (window.devToolsExtension) {

  // we can't have the last argument of compose() be undefined
  middlewares.push(window.devToolsExtension());
}

const coralReducers = {
  ...mainReducer,
  apollo: client.reducer()
};

const store = createStore(
  combineReducers(coralReducers),
  {},
  compose(...middlewares)
);

store.coralReducers = coralReducers;

window.coralStore = store;
export default store;
