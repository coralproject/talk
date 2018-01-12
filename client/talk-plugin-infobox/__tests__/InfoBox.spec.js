import React from 'react';
import { shallow } from 'enzyme';
import InfoBox from '../InfoBox';
import renderer from 'react-test-renderer';

const render = props => shallow(<InfoBox {...props} />);

describe('InfoBox', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<InfoBox content="test" enable />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render hidden InfoBox', () => {
    const wrapper = render();
    const className = wrapper.prop('className');
    expect(className).toMatch('-info');
    expect(className).toMatch('hidden');
  });

  it('should render enabled InfoBox', () => {
    const wrapper = render({ enable: true });
    const className = wrapper.prop('className');
    expect(className).toMatch('-info');
    expect(className).not.toMatch('hidden');
  });

  it('should render Markdown', () => {
    const wrapper = render({ content: 'x' });
    const Markddown = wrapper.find('Markdown');
    expect(Markddown).toHaveLength(1);
    expect(Markddown.prop('content')).toEqual('x');
  });
});
