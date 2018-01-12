import { Component, cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

export default class ClickOutside extends Component {
  static propTypes = {
    onClickOutside: PropTypes.func,
    children: PropTypes.node,
  };

  static contextTypes = {
    pym: PropTypes.object,
  };

  domNode = null;

  handleClick = e => {
    const { onClickOutside } = this.props;
    if (!e || !this.domNode.contains(e.target)) {
      onClickOutside && onClickOutside(e);
    }
  };

  componentDidMount() {
    const { pym } = this.context;
    this.domNode = findDOMNode(this);
    document.addEventListener('click', this.handleClick, true);
    if (pym) {
      pym.onMessage('click', this.handleClick);
    }
  }

  componentWillUnmount() {
    const { pym } = this.context;
    document.removeEventListener('click', this.handleClick, true);
    if (pym) {
      pym.messageHandlers.click = pym.messageHandlers.click.filter(
        h => h !== this.handleClick
      );
    }
  }

  render() {
    const { children, onClickOutside: _, ...rest } = this.props;
    return cloneElement(Children.only(children), rest);
  }
}
