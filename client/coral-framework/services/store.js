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

  if (window.devToolsExtension) {
    // we can't have the last argument of compose() be undefined
    enhancers.push(window.devToolsExtension());
  }

  return reduxCreateStore(combineReducers(reducers), {}, compose(...enhancers));
}
