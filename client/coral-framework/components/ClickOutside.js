import {Component, cloneElement, Children} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import {pym} from 'coral-framework';

export default class ClickOutside extends Component {
  static propTypes = {
    onClickOutside: PropTypes.func.isRequired
  };

  domNode = null;

  handleClick = (e) => {
    const {onClickOutside} = this.props;
    if (!e || !this.domNode.contains(e.target)) {
      onClickOutside(e);
    }
  };

  componentDidMount() {
    this.domNode = findDOMNode(this);
    document.addEventListener('click', this.handleClick, true);
    pym.onMessage('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true);
    pym.messageHandlers.click = pym.messageHandlers.click.filter((h) => h !== this.handleClick);
  }

  render() {
    const {children, onClickOutside: _, ...rest} = this.props;
    return cloneElement(Children.only(children), rest);
  }
}
