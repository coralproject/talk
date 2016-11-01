import React, {Component, PropTypes, Children, cloneElement} from 'react'

/*
* Renders a set of dynamic components bases on a root id
*
*/

class RootContainer extends Component {

  static propTypes = {
    rootId: PropTypes.string.isRequired,
    items: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    query: PropTypes.string.isRequired,
    getItemsQuery: PropTypes.func.isRequired
  }

  componentDidMount () {
    const {query, getItemsQuery, rootId, view} = this.props
    getItemsQuery(query, rootId, view)
  }

  render () {
    const {items, rootId, type, children} = this.props
    if (items[rootId] && items[rootId].type !== type) {
      console.warn('Id passed to RootContainer gets an object of an unexpected type. Expected ' + type + ' but got ' + items[rootId].type)
    }
    return <div className='rootContainer'>
      {
        items[rootId] &&
        Children.map(children, (ChildComponent) => {
          return cloneElement(
            ChildComponent,
            {
              item_id: rootId,
              items: items
            })
        })
      }
    </div>
  }
}

export default RootContainer
