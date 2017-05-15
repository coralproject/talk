import React, {PropTypes} from 'react';
import I18n from 'coral-i18n/modules/i18n/i18n';
import onClickOutside from 'react-onclickoutside';
const name = 'coral-plugin-permalinks';
import {Button} from 'coral-ui';
import styles from './styles.css';

const lang = new I18n();

class PermalinkButton extends React.Component {

  static propTypes = {
    articleURL: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {popoverOpen: false, copySuccessful: null, copyFailure: null};
    this.toggle = this.toggle.bind(this);
    this.copyPermalink = this.copyPermalink.bind(this);
  }

  toggle () {

    // I wish I could position this with a stylesheet, but top-level comments with
    // nested replies throws everything off, as well as very long comments
    this.popover.style.top = `${this.linkButton.offsetTop - 80}px`;
    this.setState({popoverOpen: !this.state.popoverOpen});
  }

  handleClickOutside () {
    this.setState({popoverOpen: false});
  }

  copyPermalink () {
    this.permalinkInput.select();
    try {
      document.execCommand('copy');
      this.setState({copySuccessful: true, copyFailure: null});
    } catch (err) {
      this.setState({copyFailure: true, copySuccessful: null});
    }

    setTimeout(() => {
      this.setState({copyFailure: null, copySuccessful: null});
    }, 3000);
  }

  render () {
    const {copySuccessful, copyFailure} = this.state;
    return (
      <div className={`${name}-container`}>
        <button
          ref={ref => this.linkButton = ref}
          onClick={this.toggle}
          className={`${name}-button`}>
          {lang.t('permalink')}
          <i className={`${name}-icon material-icons`} aria-hidden={true}>link</i>
        </button>
        <div
          ref={ref => this.popover = ref}
          className={`${name}-popover ${styles.container} ${this.state.popoverOpen ? 'active' : ''}`}>
          <input
            className={`${name}-copy-field`}
            type='text'
            ref={input => this.permalinkInput = input}
            value={`${this.props.articleURL}#${this.props.commentId}`}
            onChange={() => {}} />
          <Button className={`${name}-copy-button ${copySuccessful ? styles.success : ''} ${copyFailure ? styles.failure : ''}`}
                  onClick={this.copyPermalink} >
            {!copyFailure && !copySuccessful && 'Copy'}
            {copySuccessful && 'Copied'}
            {copyFailure && 'Not supported'}
          </Button>
        </div>
      </div>
    );
  }
}

export default onClickOutside(PermalinkButton);
