import React from 'react'
import {shallow, mount} from 'enzyme'
import {expect} from 'chai'
import CommentBox from '../CommentBox'

describe('CommentBox', () => {
  let comment
  let render
  beforeEach(() => {
    comment = {}
    const postItem = (item) => {
      comment.posted=item
      return Promise.resolve(4)
    }
    render = shallow(<CommentBox
      postItem={postItem}
      updateItem={(e) => comment.text=e.target.value}
      item_id={'1'}
      comments={['1', '2', '3']}/>)
  })

  it('should render the CommentBox appropriately', () => {
    expect(render.contains('<div class="CommentBox"')).to.be.truthy
    expect(render.contains('<button class="postCommentButton"')).to.be.truthy
  })
})
