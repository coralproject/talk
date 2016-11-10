/* Item Actions */

/**
 * Action name constants
 */

export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const APPEND_ITEM_ARRAY = 'APPEND_ITEM_ARRAY';

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

export const addItem = (item, item_type) => {
  if (!item.id) {
    console.warn('addItem called without an item id.');
  }
  return {
    type: ADD_ITEM,
    item,
    item_type,
    id: item.id
  };
};

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
export const updateItem = (id, property, value, item_type) => {
  return {
    type: UPDATE_ITEM,
    id,
    property,
    value,
    item_type
  };
};

export const appendItemArray = (id, property, value, add_to_front, item_type) => {
  return {
    type: APPEND_ITEM_ARRAY,
    id,
    property,
    value,
    add_to_front,
    item_type
  };
};

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
    return fetch(`/api/v1/stream?asset_id=${assetId}`)
      .then(
        response => {
          return response.ok ? response.json() : Promise.reject(`${response.status} ${response.statusText}`);
        }
      )
      .then((json) => {

        /* Add items to the store */
        const itemTypes = Object.keys(json);
        for (let i = 0; i < itemTypes.length; i++ ) {
          for (let j = 0; j < json[itemTypes[i]].length; j++ ) {
            dispatch(addItem(json[itemTypes[i]][j], itemTypes[i]));
          }
        }

        /* Sort comments by date*/
        json.comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const rels = json.comments.reduce((h, item) => {
          /* Check for root and child comments. */
          if (
            item.asset_id === assetId &&
            !item.parent_id) {
            h.rootComments.push(item.id);
          } else if (
            item.asset_id === assetId
          ) {
            let children = h.childComments[item.parent_id] || [];
            h.childComments[item.parent_id] = children.concat(item.id);
          }
          return h;
        }, {rootComments: [], childComments: {}});

        dispatch(addItem({
          id: assetId,
          comments: rels.rootComments,
        }, 'assets'));

        const childKeys = Object.keys(rels.childComments);
        for (let i = 0; i < childKeys.length; i++ ) {
          dispatch(updateItem(childKeys[i], 'children', rels.childComments[childKeys[i]].reverse(), 'comments'));
        }

        /* Hydrate actions on comments */
        for (let i = 0; i < json.actions.length; i++ ) {
          dispatch(updateItem(json.actions[i].item_id, json.actions[i].action_type, json.actions[i].id, 'comments'));
        }

        return (json);
      });
  };
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
    return fetch(`/v1/item/${ids}`)
      .then(
        response => {
          return response.ok ? response.json()
          : Promise.reject(`${response.status  } ${  response.statusText}`);
        }
      )
      .then((json) => {
        for (let i = 0; i < json.items.length; i++) {
          dispatch(addItem(json.items[i]));
        }
        return json.items;
      });
  };
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
      item.id = id;
    }
    let options = {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type':'application/json'
      }
    };
    return fetch(`/api/v1/${type}`, options)
      .then(
        response => {
          return response.ok ? response.json()
          : Promise.reject(`${response.status} ${response.statusText}`);
        }
      )
      .then((json) => {
        dispatch(addItem({...item, id:json.id}, type));
        return json.id;
      });
  };
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

export function postAction (item_id, action_type, user_id, item_type) {
  return () => {
    const action = {
      action_type,
      user_id
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(action)
    };

    return fetch(`/api/v1/${item_type}/${item_id}/actions`, options)
      .then(
        response => {
          return response.ok ? response.json()
          : Promise.reject(`${response.status} ${response.statusText}`);
        }
      ).then((json)=>{
        return json;
      });
  };
}
