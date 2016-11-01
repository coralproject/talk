import React, {Component, PropTypes, Children, cloneElement} from 'react'

class DynamicContainer extends Component {

  constructor (props) {
    super(props)
    this.getPropsFromItems = this.getPropsFromItems.bind(this)
  }

  static propTypes = {
    name: PropTypes.string,
    items: PropTypes.object,
    item_id: PropTypes.string
  }

  traverseEdges (edges, index, query) {
    let bracketCount = 0
    let subqueryLength = 0
    let subquery = query.slice(index).reduce((subquery, char, i) => {
      if (bracketCount === 0 && i !== 0) {
        return subquery
      }
      subqueryLength++
      switch (char) {
        case '{':
          bracketCount++
          break
        case '}':
          bracketCount--
          break
      }
      const result = subquery += char
      return result
    }, '')
    query.splice(index, subqueryLength-1)
    return edges ? edges.reduce((array, edge) => {
      array.push(this.getPropsFromItems(subquery, edge))
      return array
    }, []) : undefined
  }

  getPropsFromItems (query, id) {
    let idStack = [id.toString()]
    let relationshipStack = []
    let result = {}

    query.split('').reduce((string, char, i, q) => {
      const id = idStack[idStack.length - 1]
      if (!this.props.items[id]) {
        return ''
      }
      let object = relationshipStack.reduce((object, relationship) => {
        return object[relationship]
      }, result)
      if (/[^{},]/i.test(char)) {
        return string + char
      }
      // Ignore spaces
      if (/\s/.test(char)) {
        return string
      }
      switch (char) {
        case '{':
          if (!string) {
            return string
          }
          const rgx = /(.*)\(type:\s?('|")(.+)('|")\)|^{/.exec(string)
          if (!rgx) {
            console.warn('Invalid graphQL: ' + string + ' in ' + query)
            console.warn('Expecting format {relationship(type:"itemType"{prop1, prop2}')
            return ''
          }

          const edge = rgx[1]
          const type = rgx[3]
          let typetest
          if (edge && this.props.items[id].related) {
            idStack.push(this.props.items[id].related[edge])
            relationshipStack.push(edge)
            let val = this.props.items[id].related[edge]
            if (!val || val.constructor === Array) {
              object[edge] = this.traverseEdges(val, i, q)
              idStack.pop()
              relationshipStack.pop()
            } else {
              object[edge] = {}
            }
            typetest = this.props.items[val]
          } else {
            typetest = this.props.items[id]
          }
          if (typetest && typetest.type !== type) {
            console.warn('Received unexpected type when getting props, expected ' + edge + ' of type ' + type + ' but found ' + typetest.type + '.')
          }
          break
        case '}':
          idStack.pop()
          relationshipStack.pop()
          if (!string) {
            return string
          }
          if (string === 'item_id' ||
              string === 'type' ||
              string === 'created_at' ||
              string === 'updated_at') {
            object[string] = this.props.items[id][string]
          } else {
            object[string] = this.props.items[id].data[string]
          }
          break
        case ',':
          if (!string) {
            return string
          }
          if (string === 'item_id' ||
              string === 'type' ||
              string === 'created_at' ||
              string === 'updated_at') {
            object[string] = this.props.items[id][string]
          } else {
            object[string] = this.props.items[id].data[string]
          }
          break
      }
      return ''
    }, '')
    return result
  }

  render () {
    return <div className={this.props.name}>
      {
        Children.map(this.props.children, (child) => {
          if (child.type.name === 'DynamicContainer' || child.type.name === 'MapContainer') {
            return cloneElement(child, {
              item_id: this.props.item_id,
              items: this.props.items
            })
          }
          if (!child.props.data) {
            return child
          }
          const props = this.getPropsFromItems(child.props.data, this.props.item_id)
          return cloneElement(
            child,
            {
              data: undefined,
              ...props
            })
        })
      }
    </div>
  }
}

export default DynamicContainer
