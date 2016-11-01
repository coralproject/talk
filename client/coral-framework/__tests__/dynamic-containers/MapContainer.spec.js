import React from 'react'
import {shallow} from 'enzyme'
import {expect} from 'chai'
import MapContainer from '../../dynamic-containers/MapContainer'

describe('<MapContainer/>', () => {
  let items
  beforeEach (() => {
    items = {
      a: {
        item_id: 'a',
        type: 'stream',
        data: {
          url: "http://a.site"
        },
        related: {
          comment: ['b', 'c']
        }
      }
    }
  })
  it('should map children and pass them the appropriate item ids', () => {
    const map = shallow(<MapContainer
      item_id={'a'}
      mapOver="comment"
      items={items}>
        <div/>
        <div/>
      </MapContainer>)
    expect(map.node.props.className).to.equal('mapcomment')
    expect(map.node.props.children.length).to.equal(2)
    expect(map.node.props.children[0]).to.have.property('key')
      .and.to.equal('b')
    expect(map.node.props.children[0].props.children[0].props).to.have.property('item_id')
      .and.to.equal('b')
    expect(map.node.props.children[1]).to.have.property('key')
      .and.to.equal('c')
    expect(map.node.props.children[1].props.children[0].props).to.have.property('item_id')
      .and.to.equal('c')
  })
  it('should pass its items and config objects on to its children', () => {
    const map = shallow(<MapContainer
      item_id={'a'}
      mapOver="comment"
      items={items}>
        <div/>
        <div/>
      </MapContainer>)
    expect(map.node.props.children[0].props.children[0].props).to.have.property('items')
      .and.to.deep.equal(items)
    expect(map.node.props.children[1].props.children[0].props).to.have.property('items')
      .and.to.deep.equal(items)
  })
})
