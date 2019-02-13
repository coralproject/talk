import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';

/**
 * createStore creates a Redux Store
 * @param  {Object}  reducers       addtional reducers
 * @param  {Array}   [middlewares]  additional middlewares
 * @return {Object}  redux store
 */
export function createStore(reducers, middlewares = []) {
  const enhancers = [applyMiddleware(...middlewares)];

  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    // we can't have the last argument of compose() be undefined
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }

  return reduxCreateStore(combineReducers(reducers), {}, compose(...enhancers));
}
