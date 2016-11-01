import React from 'react'
import {shallow, mount} from 'enzyme'
import {expect} from 'chai'
import CommentContent from '../CommentContent'

describe('CommentContent', () => {
  it('should render content', () => {
    const render = shallow(<CommentContent content="test"/>)
    expect(render.contains('test')).to.be.truthy
  })
})
