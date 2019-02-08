import React from 'react';
import cn from 'classnames';
import styles from './styles.css';
import { t } from 'plugin-api/beta/client/services';
import { buildCommentURL } from 'plugin-api/beta/client/utils';
import { ClickOutside } from 'plugin-api/beta/client/components';
import { Icon, Button } from 'plugin-api/beta/client/components/ui';

const name = 'talk-plugin-permalink';

export default class PermalinkButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: false,
      copySuccessful: null,
      copyFailure: null,
    };
  }

  toggle = () => {
    this.popover.style.top = `${this.linkButton.offsetTop - 80}px`;

    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  };

  handleClickOutside = () => {
    if (this.state.popoverOpen) {
      this.setState({
        popoverOpen: false,
      });
    }
  };

  copyPermalink = () => {
    const iOS = navigator && navigator.userAgent.match(/ipad|iphone/i);

    if (iOS) {
      let range = document.createRange();
      range.selectNodeContents(this.permalinkInput);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      this.permalinkInput.setSelectionRange(0, 999999);
    } else {
      this.permalinkInput.select();
    }
    try {
      document.execCommand('copy');
      this.setState({
        copySuccessful: true,
        copyFailure: null,
      });
    } catch (err) {
      this.setState({
        copyFailure: true,
        copySuccessful: null,
      });
    }

    this.timeout = window.setTimeout(() => {
      this.setState({
        copyFailure: null,
        copySuccessful: null,
      });
    }, 3000);
  };

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  render() {
    const { copySuccessful, copyFailure, popoverOpen } = this.state;
    const { asset, comment } = this.props;
    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div className={cn(`${name}-container`, styles.container)}>
          <button
            ref={ref => (this.linkButton = ref)}
            onClick={this.toggle}
            className={cn(`${name}-button`, styles.button)}
          >
            <span className="talk-plugin-permalink-button-label">
              {t('permalink')}
            </span>
            <Icon name="link" className={styles.icon} />
          </button>

          <div
            ref={ref => (this.popover = ref)}
            className={cn([
              `${name}-popover`,
              styles.popover,
              { [styles.active]: popoverOpen },
            ])}
          >
            <input
              className={cn(styles.input, `${name}-copy-field`)}
              type="text"
              ref={input => (this.permalinkInput = input)}
              defaultValue={buildCommentURL(asset.url, comment.id)}
              readOnly
            />

            <Button
              onClick={this.copyPermalink}
              className={cn([
                styles.copyButton,
                `${name}-copy-button`,
                {
                  [styles.success]: copySuccessful,
                  [styles.failure]: copyFailure,
                },
              ])}
            >
              {!copyFailure && !copySuccessful && t('common.copy')}
              {copySuccessful && t('common.copied')}
              {copyFailure && t('common.notsupported')}
            </Button>
          </div>
        </div>
      </ClickOutside>
    );
  }
}
