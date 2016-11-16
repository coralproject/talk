import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import InfoBox from '../InfoBox';

describe('InfoBox', () => {
  let comment;
  let render;
  beforeEach(() => {
    comment = {};
    const postItem = (item) => {
      comment.posted = item;
      return Promise.resolve(4);
    };
    render = shallow(<InfoBox
      postItem={postItem}
      updateItem={(e) => comment.text = e.target.value}
      item_id={'1'}
      comments={['1', '2', '3']}/>);
  });

  it('should render the InfoBox appropriately', () => {
    expect(render.contains('<div class="InfoBox"')).to.be.truthy;
    expect(render.contains('<button class="postCommentButton"')).to.be.truthy;
  });
});
