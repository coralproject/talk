/* @flow */

import { Map, fromJS } from 'immutable'
import * as actions from '../actions/config'

const initialState = Map({
  features: Map({})
})

export default (state = initialState, action) => {
  switch(action.type) {
    case actions.FETCH_CONFIG_REQUEST:
      return state.set('loading', true)

    case actions.FETCH_CONFIG_FAILED:
      return state.set('loading', false)

    // Override config if worked
    case actions.FETCH_CONFIG_SUCCESS:
      return action.config.set('loading', false)

    default:
      return state
  }
}
