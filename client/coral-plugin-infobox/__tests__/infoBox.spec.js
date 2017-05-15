import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import InfoBox from '../InfoBox';

const render = (props) => shallow(<InfoBox {...props} />);

describe('InfoBox', () => {
  it('should render hidden InfoBox', () => {
    const wrapper = render();
    const className = wrapper.prop('className');
    expect(className).to.include('-info');
    expect(className).to.include('hidden');
  });

  it('should render enabled InfoBox', () => {
    const wrapper = render({enable: true});
    const className = wrapper.prop('className');
    expect(className).to.include('-info');
    expect(className).to.not.include('hidden');
  });

  it('should render Markdown', () => {
    const wrapper = render({content: 'x'});
    const Markddown = wrapper.find('Markdown');
    expect(Markddown).to.have.length(1);
    expect(Markddown.prop('content')).to.equal('x');
  });
});
