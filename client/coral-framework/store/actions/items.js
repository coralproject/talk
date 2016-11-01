/* Item Actions */

import { fromJS } from 'immutable'

/**
 * Action name constants
 */

export const ADD_ITEM = 'ADD_ITEM'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const APPEND_ITEM_ARRAY = 'APPEND_ITEM_ARRAY'
export const APPEND_ITEM_RELATED = 'APPEND_ITEM_RELATED'

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
  if (!item.item_id) {
    console.warn('addItem called without an item id.')
  }
  return {
    type: ADD_ITEM,
    item: item,
    item_id: item.item_id
  }
}

/*
* Updates an item in the local store without posting it to the server
* Useful for item-level toggles, etc.
*
* @params
*  item_id - the id of the item to be posted
*  property - the property to be updated
*  value - the value that the property should be set to
*
*/


export const updateItem = (item_id, property, value) => {
  return {
    type: UPDATE_ITEM,
    item_id,
    property,
    value
  }
}

export const appendItemArray = (item_id, property, value) => {
  return {
    type: APPEND_ITEM_ARRAY,
    item_id,
    property,
    value
  }
}


export const appendItemRelated = (item_id, property, value) => {
  return {
    type: APPEND_ITEM_RELATED,
    item_id,
    property,
    value
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
export function getItemsQuery (query, rootId, view, host) {
  return (dispatch) => {
    return fetch(host + '/v1/exec/' + query + '/view/' + view + '/' + rootId)
      .then(
        response => {
          return response.ok ? response.json() : Promise.reject(response.status + ' ' + response.statusText)
        }
      )
      .then((json) => {
        let items = json.results[0].Docs
        for (var i = 0; i < items.length; i++) {
          dispatch(addItem(items[i]))
        }
        return (items)
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

export function getItemsArray (ids, host) {
  return (dispatch) => {
    return fetch(host + '/v1/item/' + ids)
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

export function postItem (data, type, id, host) {
  return (dispatch) => {
    let item = {
      type,
      data,
      version: 1
    }
    if (id) {
      item.item_id = id
    }
    let options = {
      method: 'POST',
      body: JSON.stringify(item)
    }
    return fetch(host + '/v1/item', options)
      .then(
        response => {
          return response.ok ? response.json()
          : Promise.reject(response.status + ' ' + response.statusText)
        }
      )
      .then((json) => {
        // Patch until ID is returned from backend
        dispatch(addItem(json))
        return json.item_id
      })
  }
}

//http://localhost:16180/v1/action/flag/user/user_89654/on/item/87e418c5-aafb-4eb7-9ce4-78f28793782a

/*
* PostAction
* Posts an action to an item
*
* @params
*   item_id - the id of the item on which the action is taking place
*   action - the name of the action
*   user - the user performing the action
*   host - the coral host
*
* @returns
*   A promise resolving to null or an error
*
*/

export function postAction (item, action, user, host) {
  return (dispatch) => {
    let options = {
      method: 'POST'
    }
    dispatch(appendItemArray(item, action, user))
    return fetch(host + '/v1/action/' + action + '/user/' + user + '/on/item/' + item, options)
      .then(
        response => {
          return response.ok ? response.text()
          : Promise.reject(response.status + ' ' + response.statusText)
        }
      )
  }
}
