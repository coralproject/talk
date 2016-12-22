
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import mainReducer from 'reducers';

/**
 * Create the store by merging the app reducers with
 * the talk adapter. The talk adapter is the wire between
 * this client and the coral backend. The idea is we can
 * write different adapters for other platforms if we want
 */

export default createStore(
  mainReducer,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk)
);
