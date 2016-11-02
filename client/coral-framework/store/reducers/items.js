/* Items Reducer */

import { Map, fromJS } from 'immutable'
import * as actions from '../actions/items'

const initialState = fromJS({})

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_ITEM:
      return state.set(action.item_id, fromJS(action.item))
    case actions.UPDATE_ITEM:
      return state.updateIn([action.item_id, 'data', action.property], () =>
        fromJS(action.value)
      )
    case actions.APPEND_ITEM_ARRAY:
      return state.updateIn([action.item_id, 'data', action.property], (prop) => {
        return prop ? prop.push(action.value) : fromJS([action.value])
      }
    )
    case actions.APPEND_ITEM_RELATED:
      return state.updateIn([action.item_id, 'related', action.property], (prop) => {
        return prop ? prop.push(action.value) : fromJS([action.value])
      }
    )
    default:
      return state
  }
}
