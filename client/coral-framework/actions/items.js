import coralApi from '../helpers/response';
import {fromJS} from 'immutable';
import {UPDATE_CONFIG} from '../constants/config';

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
*  item_type - the type of the item being updated (users, comments, etc)
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

/*
* Appends data to an array in an item in the local store without posting it to the server
* Useful for adding a recently posted reply to a comment, etc.
*
* @params
*  id - the id of the item to be posted
*  property - the property to be updated (should be an array)
*  value - the value that should be added to the array
*  add_to_front - boolean that defines whether value is added at the beginning (unshift) or end (push)
*  item_type - the type of the item being updated (users, comments, etc)
*
*/
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
export function getStream (assetUrl) {
  return (dispatch) => {
    return coralApi(`/stream?asset_url=${encodeURIComponent(assetUrl)}`)
      .then((json) => {

        /* Add items to the store */
        Object.keys(json).forEach(type => {
          if (type === 'actions') {
            json[type].forEach(action => {
              action.id = `${action.action_type}_${action.item_id}`;
              dispatch(addItem(action, 'actions'));
            });
          } else if (type === 'settings') {
            dispatch({type: UPDATE_CONFIG, config: fromJS(json[type])});
          } else {
            json[type].forEach(item => {
              dispatch(addItem(item, type));
            });
          }
        });

        const assetId = json.assets[0].id;

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

        dispatch(updateItem(assetId, 'comments', rels.rootComments, 'assets'));

        Object.keys(rels.childComments).forEach(key => {
          dispatch(updateItem(key, 'children', rels.childComments[key].reverse(), 'comments'));
        });

        /* Hydrate actions on comments */
        json.actions.forEach(action => {
          dispatch(updateItem(action.item_id, action.action_type, action.id, 'comments'));
        });

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
    return coralApi(`/item/${ids}`)
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

export function postItem (item, type, id, mutate) {
  console.log(
    item,
    type,
    id,
    mutate
  );
  mutate({
    variables: {
      asset_id: id,
      body: item,
      parent_id: null
    }
  }).then(({data}) => {
    console.log('it workt');
    console.log(data);
  });

  // return (dispatch) => {
  //   if (id) {
  //     item.id = id;
  //   }
  //   return coralApi(`/${type}`, {method: 'POST', body: item})
  //     .then((json) => {
  //       dispatch(addItem({...item, id:json.id}, type));
  //       return json;
  //     });
  // };
}

/*
* PostAction
* Posts an action to an item
*
* @params
*   id - the id of the item on which the action is taking place
*   action - the action object.
*       Must include an 'action_type' string.
*       May optionally include a `metadata` object with arbitrary action data.
*   user - the user performing the action
*   host - the coral host
*
* @returns
*   A promise resolving to null or an error
*
*/

export function postAction (item_id, item_type, action) {
  return (dispatch) => {
    return coralApi(`/${item_type}/${item_id}/actions`, {method: 'POST', body: action})
      .then((json) => {
        dispatch(updateItem(action.item_id, action.action_type, action.id, item_type));
        return json;
      });
  };
}

/*
* DeleteAction
* Deletes an action to an item
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

export function deleteAction (action_id) {
  return () => {
    return coralApi(`/actions/${action_id}`, {method: 'DELETE'});
  };
}
