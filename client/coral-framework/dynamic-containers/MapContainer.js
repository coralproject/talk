import React, {Children, cloneElement} from 'react'

/*
* Maps a set of children onto an array of item ids
* e.g. Displaying a stream of comments
*
* @props
*   id- The id of the item with the property to be mapped.
*   mapOver- The property to be mapped. Should be an array of ids.
*   items- All items in the redux store.
*/

const MapContainer = ({items, item_id, mapOver, children}) => {
  if (!items[item_id] || !items[item_id].related) {
    return null
  }
  const itemArray = items[item_id].related[mapOver]
  if (!itemArray) {
    return null
  }
  return <div className={'map' + mapOver}>
    {
      itemArray.map((item) => {
        return <div key={item}>
          {
            Children.map(children, (ChildComponent) => {
              let elem = cloneElement(
                ChildComponent,
                {
                  item_id: item,
                  items: items
                })
              return elem
            })
          }
        </div>
      })
    }
  </div>
}

export default MapContainer
