import React from 'react';
import { shallow } from 'enzyme';
import Markdown from '../Markdown';

const render = props => shallow(<Markdown {...props} />);

describe('Markdown', () => {
  it('should convert Markdown to html', () => {
    const wrapper = render({ content: '*test*' });
    const html = wrapper.html();
    expect(html).toMatch('<em>');
  });

  it('should set target="_parent" for links', () => {
    const wrapper = render({ content: '[link](https://coralproject.net)' });
    const html = wrapper.html();
    expect(html).toMatch('target="_parent"');
  });
});
