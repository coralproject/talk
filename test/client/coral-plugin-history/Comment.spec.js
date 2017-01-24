import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import Comment from '../../../client/coral-plugin-history/Comment';

describe('coral-plugin-history/Comment', () => {
  let render;
  const comment = {body: 'this is a comment', id: '123'};
  const asset = {url: 'https://google.com'};

  beforeEach(() => {
    render = shallow(<Comment asset={asset} comment={comment} link={()=>{}}/>);
  });

  it('should render the provided comment body', () => {
    const wrapper = mount(<Comment asset={asset} comment={comment} link={()=>{}}/>);
    expect(wrapper.find('.myCommentBody')).to.have.length(1);
    expect(wrapper.find('.myCommentBody').text()).to.equal('this is a comment');
  });

  it('should render the asset url as a link', () => {
    const wrapper = mount(<Comment asset={asset} comment={comment} link={()=>{}}/>);
    expect(wrapper.find('.myCommentAnchor')).to.have.length(1);
    expect(wrapper.find('.myCommentAnchor').text()).to.equal('https://google.com');
  });

  it('should render the comment with styles', () => {
    expect(render.props().style).to.be.defined;
  });
});
