import { Map } from 'immutable'
import {expect} from 'chai'
import authReducer from '../../store/reducers/auth'
import * as actions from '../../store/actions/auth'

describe ('authReducer', () => {
  describe('SET_LOGGED_IN_USER', () => {
    it('should set a logged in user', () => {
      const action = {
        type: actions.SET_LOGGED_IN_USER,
        user_id: '123'
      }
      const store = new Map({})
      const result = authReducer(store, action)
      expect(result.get('user')).to.equal(action.user_id)
    })
  })

  describe('LOG_OUT_USER', () => {
    it('should clear the user store', () => {
      const action = {
        type: actions.LOG_OUT_USER
      }
      const store = new Map({
        user: '123'
      })
      const result = authReducer(store, action)
      expect(result.get('user')).to.equal(undefined)
    })
  })
})
