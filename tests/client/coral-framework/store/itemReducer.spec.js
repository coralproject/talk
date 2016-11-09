import { Map, fromJS } from 'immutable'
import {expect} from 'chai'
import itemsReducer from '../../../../client/coral-framework/store/reducers/items'
import * as actions from '../../../../client/coral-framework/store/actions/items'

describe ('itemsReducer', () => {
  describe('ADD_ITEM', () => {
    it('should add an item', () => {
      const action = {
        type: 'ADD_ITEM',
        item: {
          body: 'stuff',
          id: '123'
        },
        item_type: 'comments',
        id: '123'
      }
      const store = new Map({})
      const result = itemsReducer(store, action)
      expect(result.getIn(['comments','123']).toJS()).to.deep.equal({
        body: 'stuff',
        id: '123'
      })
    })
  })

  describe ('UPDATE_ITEM', () => {
    it ('should update an item', () => {
      const action = {
        type: 'UPDATE_ITEM',
        property: 'stuff',
        value: 'things',
        item_type: 'comments',
        id: '123'
      }
      const store = fromJS({
        'comments': {
          '123': {
            id: '123',
            stuff: 'morestuff'
          }
        }
      });
      const result = itemsReducer(store, action)
      expect(result.getIn(['comments','123']).toJS()).to.deep.equal({
        id: '123',
        stuff: 'things'
      })
    })
  })

  describe('APPEND_ITEM_ARRAY', () => {
    let action
    let store

    beforeEach (() => {
      action = {
        type: 'APPEND_ITEM_ARRAY',
        property: 'stuff',
        value: 'things',
        id: '123',
        item_type: 'comments'
      }
      store = fromJS({
        'comments': {
          '123': {
            id: '123',
            stuff: ['morestuff']
          }
        }
      })
    })
    it ('should append to an existing array', () => {
      const result = itemsReducer(store, action)
      expect(result.getIn(['comments','123']).toJS()).to.deep.equal({
        id: '123',
        stuff: ['morestuff', 'things']
      })
    })
    it ('should create a new array', () => {
      store = fromJS({
        'comments': {
          '123': {
            id: '123'
          }
        }
      })
      const result = itemsReducer(store, action)
      expect(result.getIn(['comments','123']).toJS()).to.deep.equal({
        id: '123',
        stuff: ['things']
      })
    })
  })

})
