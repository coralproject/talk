import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/auth';
import {client} from './client';

export default createStore(
  combineReducers({
    auth: authReducer,
    apollo: client.reducer()
  }),
  {},
  compose(
    window.devToolsExtension && window.devToolsExtension(),
    applyMiddleware(thunk)
  )
);
