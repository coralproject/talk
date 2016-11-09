/* @flow */

import {fromJS} from 'immutable';

/**
 * Action name constants
 */

export const FETCH_CONFIG_REQUEST = 'FETCH_CONFIG_REQUEST';
export const FETCH_CONFIG_FAILED = 'FETCH_CONFIG_FAILED';
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS';

/**
 * Action creators
 */

export const fetchConfig = () => async (dispatch) => {
  dispatch({type: FETCH_CONFIG_REQUEST});

  try {
    //TODO: Replace with fetching config from backend
    // const response = await fetch(`./talk.config.json`)
    // const json = await response.json()
    dispatch({type: FETCH_CONFIG_SUCCESS, config: fromJS({})});
  } catch (error) {
    dispatch({type: FETCH_CONFIG_FAILED});
  }
};
