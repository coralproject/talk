import { Map, fromJS } from 'immutable'
import {expect} from 'chai'
import itemsReducer from '../../store/reducers/items'
import * as actions from '../../store/actions/items'

describe ('itemsReducer', () => {
  describe('ADD_ITEM', () => {
    it('should add an item', () => {
      const action = {
        type: 'ADD_ITEM',
        item: {
          type: 'comment',
          data: {
            content: 'stuff'
          },
          item_id: '123'
        },
        item_id: '123'
      }
      const store = new Map({})
      const result = itemsReducer(store, action)
      expect(result.get('123').toJS()).to.deep.equal({
        type: 'comment',
        data: {
          content: 'stuff'
        },
        item_id: '123'
      })
    })
  })

  describe ('UPDATE_ITEM', () => {
    it ('should update an item', () => {
      const action = {
        type: 'UPDATE_ITEM',
        property: 'stuff',
        value: 'things',
        item_id: '123'
      }
      const store = fromJS({
        '123': {
          item_id: '123',
          data: {
            stuff: 'morestuff'
          }
        }
      })
      const result = itemsReducer(store, action)
      expect(result.get('123').toJS()).to.deep.equal({
        item_id: '123',
        data: {
          stuff: 'things'
        }
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
        item_id: '123'
      }
      store = fromJS({
        '123': {
          item_id: '123',
          data: {
            stuff: ['morestuff']
          }
        }
      })
    })
    it ('should append to an existing array', () => {
      const result = itemsReducer(store, action)
      expect(result.get('123').toJS()).to.deep.equal({
        item_id: '123',
        data: {
          stuff: ['morestuff', 'things']
        }
      })
    })
    it ('should create a new array', () => {
      store = fromJS({
        '123': {
          item_id: '123',
          data: {}
        }
      })
      const result = itemsReducer(store, action)
      expect(result.get('123').toJS()).to.deep.equal({
        item_id: '123',
        data: {
          stuff: ['things']
        }
      })
    })
  })

  describe('APPEND_ITEM_RELATED', () => {
    let action
    let store

    beforeEach (() => {
      action = {
        type: 'APPEND_ITEM_RELATED',
        property: 'stuff',
        value: 'things',
        item_id: '123'
      }
      store = fromJS({
        '123': {
          item_id: '123',
          related: {
            stuff: ['morestuff']
          }
        }
      })
    })
    it ('should append to an existing array', () => {
      const result = itemsReducer(store, action)
      expect(result.get('123').toJS()).to.deep.equal({
        item_id: '123',
        related: {
          stuff: ['morestuff', 'things']
        }
      })
    })
    it ('should create a new array', () => {
      store = fromJS({
        '123': {
          item_id: '123',
          related: {}
        }
      })
      const result = itemsReducer(store, action)
      expect(result.get('123').toJS()).to.deep.equal({
        item_id: '123',
        related: {
          stuff: ['things']
        }
      })
    })
  })
})
