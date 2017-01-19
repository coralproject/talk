import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import mainReducer from './reducers';
import {client} from './client';

export default createStore(
  client.reducer(),
  mainReducer,
  compose(
    window.devToolsExtension && window.devToolsExtension(),
    applyMiddleware(thunk)
  )
);
