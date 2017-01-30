import React, {PropTypes} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from './translations';
import onClickOutside from 'react-onclickoutside';
const name = 'coral-plugin-permalinks';
import {Button} from 'coral-ui';
import styles from './styles.css';

const lang = new I18n(translations);

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
    }, 3500);
  }

  render () {
    const {copySuccessful, copyFailure} = this.state;
    return (
      <div className={`${name}-container`}>
        <button onClick={this.toggle} className={`${name}-button`}>
          <i className={`${name}-icon material-icons`} aria-hidden={true}>link</i>
          {lang.t('permalink.permalink')}
        </button>
        <div className={`${name}-popover ${styles.container} ${this.state.popoverOpen ? 'active' : ''}`}>
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
