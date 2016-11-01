import React from 'react'
import {shallow, mount} from 'enzyme'
import {expect} from 'chai'

import RootContainer from '../../dynamic-containers/RootContainer'

describe('<RootContainer/>', () => {
  let items
  beforeEach(() => {
    items = {
      'a': {
        type: 'stream',
        data: {comments: ['b', 'c']}
      }
    }
  })
  describe('render', () => {
    it('should render child containers with the appropriate id', () => {
      const render = shallow(<RootContainer
          rootId='a'
          type='stream'
          items={items}
          query='all'
          getItemsQuery={() => {}}>
          <div/>
          <div/>
          </RootContainer>)
      expect(render.hasClass('rootContainer')).to.be.true
      expect(render.props().children[0].props).to.have.property('item_id')
        .and.to.equal('a')
      expect(render.props().children[1].props).to.have.property('item_id')
        .and.to.equal('a')
    })
    it('should render child containers with the appropriate items', () => {
      const render = shallow(<RootContainer
          rootId='a'
          type='stream'
          items={items}
          query='all'
          getItemsQuery={() => {}}>
          <div/>
          <div/>
          </RootContainer>)
      expect(render.props().children[0].props).to.have.property('items')
        .and.to.deep.equal(items)
      expect(render.props().children[1].props).to.have.property('items')
        .and.to.deep.equal(items)
    })
  })
})
