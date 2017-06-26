import React from 'react';
import {Button} from 'coral-ui';
import styles from './styles.css';
import t from 'coral-framework/services/i18n';
import ClickOutside from 'coral-framework/components/ClickOutside';
import cn from 'classnames';

const name = 'coral-plugin-permalinks';

export default class PermalinkButton extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      popoverOpen: false,
      copySuccessful: null,
      copyFailure: null
    };

  }

  toggle = () => {
    this.popover.style.top = `${this.linkButton.offsetTop - 80}px`;

    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  handleClickOutside = () => {
    this.setState({
      popoverOpen: false
    });
  }

  copyPermalink = () => {
    this.permalinkInput.select();
    try {
      document.execCommand('copy');
      this.setState({
        copySuccessful: true,
        copyFailure: null
      });
    } catch (err) {
      this.setState({
        copyFailure: true,
        copySuccessful: null
      });
    }

    setTimeout(() => {
      this.setState({
        copyFailure: null,
        copySuccessful: null
      });
    }, 3000);
  }

  render () {
    const {copySuccessful, copyFailure, popoverOpen} = this.state;
    const {asset} = this.props;
    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div className={`${name}-container`}>
          <button
            ref={(ref) => this.linkButton = ref}
            onClick={this.toggle}
            className={`${name}-button`}>
            {t('permalink')}
            <i className={`${name}-icon material-icons`} aria-hidden={true}>link</i>
          </button>
          <div
            ref={(ref) => this.popover = ref}
            className={cn([`${name}-popover`, styles.container, {active: popoverOpen}])}>
            <input
              className={`${name}-copy-field`}
              type='text'
              ref={(input) => this.permalinkInput = input}
              value={`${asset.url}#${this.props.commentId}`}
            />

            <Button
              onClick={this.copyPermalink}
              className={cn([`${name}-copy-button`, {[style.success]:copySuccessful, [styles.failure]: copyFailure}])}
            >
              {!copyFailure && !copySuccessful && 'Copy'}
              {copySuccessful && 'Copied'}
              {copyFailure && 'Not supported'}
            </Button>
          </div>
        </div>
      </ClickOutside>
    );
  }
}
