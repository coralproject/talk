/* Items Notifications */

import * as actions from '../actions/notification'
import { fromJS } from 'immutable'

const initialState = fromJS({})

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_NOTIFICATION:
      return state.set('text', action.text).set('type', action.notifType)
    case actions.CLEAR_NOTIFICATION:
      return initialState
    default:
      return state
  }
}
