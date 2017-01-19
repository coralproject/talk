import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import mainReducer from './reducers';
import {client} from './client';

export default createStore(
  combineReducers({
    ...mainReducer,
    apollo: client.reducer(),
  }),
  {}, // Initial State. We need to set this
  compose(
    window.devToolsExtension && window.devToolsExtension(),
    applyMiddleware(thunk)
  )
);
