/* Item Actions */

import { fromJS } from 'immutable'
import mocks from '../../mocks.json'

/**
 * Action name constants
 */

export const ADD_ITEM = 'ADD_ITEM'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const APPEND_ITEM_ARRAY = 'APPEND_ITEM_ARRAY'

/**
 * Action creators
 */

 /*
 * Adds an item to the local store without posting it to the server
 * Useful for optimistic posting, etc.
 *
 * @params
 *  item - the item to be posted
 *
 */

export const addItem = (item) => {
  if (!item.id) {
    console.warn('addItem called without an item id.')
  }
  return {
    type: ADD_ITEM,
    item: item,
    id: item.id
  }
}

/*
* Updates an item in the local store without posting it to the server
* Useful for item-level toggles, etc.
*
* @params
*  id - the id of the item to be posted
*  property - the property to be updated
*  value - the value that the property should be set to
*
*/


export const updateItem = (id, property, value) => {
  return {
    type: UPDATE_ITEM,
    id,
    property,
    value
  }
}

export const appendItemArray = (id, property, value, addToFront) => {
  return {
    type: APPEND_ITEM_ARRAY,
    id,
    property,
    value,
    addToFront
  }
}

/*
* Get Items from Query
* Gets a set of items from a predefined query
*
* @params
*   Query - a predefiend query for retreiving items
*
* @returns
*   A promise resolving to a set of items
*
* @dispatches
*   A set of items to the item store
*/
export function getStream (assetId) {
  return (dispatch) => {
    return fetch('/api/v1/stream?asset_id='+assetId)
      .then(
        response => {
          return response.ok ? response.json() : Promise.reject(response.status + ' ' + response.statusText)
        }
      )
      .then((json) => {

        /* Add items to the store */
        const itemTypes = Object.keys(json);
        for (let i=0; i < itemTypes.length; i++ ) {
          for (var j=0; j < json[itemTypes[i]].length; j++ ) {
              dispatch(addItem(json[itemTypes[i]][j]));
          }
        }

        /* Sort comments by date*/
        let rootComments = []
        let childComments = {}
        json.comments.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        json.comments.reduce((prev, item) => {

          /* Check for root and child comments. */
          if (
            item.asset_id === assetId &&
            !item.parent_id) {
            rootComments.push(item.id)
          } else if (
            item.asset_id === assetId
          ) {
            let children = childComments[item.parent_id] || []
            childComments[item.parent_id] = children.concat(item.id)
          }
        }, {})

        dispatch(addItem({
          id: assetId,
          comments: rootComments
        }))

        const keys = Object.keys(childComments)
        for (var i=0; i < keys.length; i++ ) {
          dispatch(updateItem(keys[i], 'children', childComments[keys[i]].reverse()))
        }

        return (json)
      })
  }
}

/*
* Get Items Array
* Gets a set of items from an array of item ids
*
* @params
*   Query - a predefiend query for retreiving items
*
* @returns
*   A promise resolving to a set of items
*
* @dispatches
*   A set of items to the item store
*/

export function getItemsArray (ids) {
  return (dispatch) => {
    return fetch('/v1/item/' + ids)
      .then(
        response => {
          return response.ok ? response.json()
          : Promise.reject(response.status + ' ' + response.statusText)
        }
      )
      .then((json) => {
        for (var i = 0; i < json.items.length; i++) {
          dispatch(addItem(json.items[i]))
        }
        return json.items
      })
  }
}

/*
* PutItem
* Puts an item
*
* @params
*   Item - the item to be put
*
* @returns
*   A promise resolving to an item is
*
* @dispatches
*   The newly put item to the item store
*/

export function postItem (item, type, id) {
  return (dispatch) => {
    if (id) {
      item.id = id
    }
    let options = {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type':'application/json'
      }
    }
    console.log('postItem', options);
    return fetch('/api/v1/' + type, options)
      .then(
        response => {
          return response.ok ? response.json()
          : Promise.reject(response.status + ' ' + response.statusText)
        }
      )
      .then((json) => {
        dispatch(addItem({...item, id:json.id}))
        return json.id
      })
  }
}

//http://localhost:16180/v1/action/flag/user/user_89654/on/item/87e418c5-aafb-4eb7-9ce4-78f28793782a

/*
* PostAction
* Posts an action to an item
*
* @params
*   id - the id of the item on which the action is taking place
*   action - the name of the action
*   user - the user performing the action
*   host - the coral host
*
* @returns
*   A promise resolving to null or an error
*
*/

export function postAction (id, type, user_id) {
  return (dispatch) => {
    const action = {
      type,
      user_id
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(action)
    }

    dispatch(appendItemArray(id, type, user_id))
    return fetch('/api/v1/comments/' + id + '/actions', options)
      .then(
        response => {
          return response.ok ? response.text()
          : Promise.reject(response.status + ' ' + response.statusText)
        }
      )
  }
}
