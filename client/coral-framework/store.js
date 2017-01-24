import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import mainReducer from './reducers';
import {client} from './client';

export default createStore(
  combineReducers({
    ...mainReducer,
    apollo: client.reducer()
  }),
  {},
  compose(
    applyMiddleware(client.middleware()),
    applyMiddleware(thunk),
    window.devToolsExtension && window.devToolsExtension()
  )
);
