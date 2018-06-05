import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Dialog } from 'coral-ui';
import styles from './BanUserDialog.css';

import Button from 'coral-ui/components/Button';
import t from 'coral-framework/services/i18n';

const initialState = { step: 0, message: '' };

class BanUserDialog extends React.Component {
  state = initialState;

  componentWillReceiveProps(next) {
    if (this.props.open && !next.open) {
      this.setState(initialState);
    }
  }

  handleMessageChange = e => {
    const {
      target: { value: message },
    } = e;
    this.setState({ message });
  };

  goToStep1 = () => {
    this.setState({
      step: 1,
      message: t('bandialog.email_message_ban', this.props.username),
    });
  };

  handlePerform = () => {
    this.props.onPerform({
      message: this.state.message,
    });
  };

  renderStep0() {
    const { onCancel, username, info } = this.props;

    return (
      <section>
        <h2 className={styles.header}>{t('bandialog.ban_user')}</h2>
        <h3 className={styles.subheader}>
          {t('bandialog.are_you_sure', username)}
        </h3>
        <p className={styles.description}>{info}</p>
        <div className={styles.buttons}>
          <Button
            className={cn('talk-ban-user-dialog-button-cancel')}
            cStyle="white"
            onClick={onCancel}
            raised
          >
            {t('bandialog.cancel')}
          </Button>
          <Button
            className={cn('talk-ban-user-dialog-button-confirm')}
            cStyle="black"
            onClick={this.goToStep1}
            raised
          >
            {t('bandialog.yes_ban_user')}
          </Button>
        </div>
      </section>
    );
  }

  renderStep1() {
    const { onCancel } = this.props;
    const { message } = this.state;

    return (
      <section>
        <h2 className={styles.header}>{t('bandialog.notify_ban_headline')}</h2>
        <p className={styles.description}>
          {t('bandialog.notify_ban_description')}
        </p>
        <fieldset>
          <legend className={styles.legend}>
            {t('bandialog.write_a_message')}
          </legend>
          <textarea
            rows={5}
            className={styles.messageInput}
            value={message}
            onChange={this.handleMessageChange}
          />
        </fieldset>
        <div className={styles.buttons}>
          <Button
            className={cn('talk-ban-user-dialog-button-cancel')}
            cStyle="white"
            onClick={onCancel}
            raised
          >
            {t('bandialog.cancel')}
          </Button>
          <Button
            className={cn('talk-ban-user-dialog-button-confirm')}
            cStyle="black"
            onClick={this.handlePerform}
            raised
          >
            {t('bandialog.send')}
          </Button>
        </div>
      </section>
    );
  }

  render() {
    const { step } = this.state;
    const { open, onCancel } = this.props;
    return (
      <Dialog
        className={cn(styles.dialog, 'talk-ban-user-dialog')}
        id="banUserDialog"
        open={open}
        onCancel={onCancel}
        title={t('bandialog.ban_user')}
      >
        <span className={styles.close} onClick={onCancel}>
          ×
        </span>
        {step === 0 && this.renderStep0()}
        {step === 1 && this.renderStep1()}
      </Dialog>
    );
  }
}

BanUserDialog.propTypes = {
  open: PropTypes.bool,
  onPerform: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  username: PropTypes.string,
  info: PropTypes.string,
};

export default BanUserDialog;
