import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, BareButton } from 'coral-ui';
import styles from './RejectUsernameDialog.css';
import cn from 'classnames';
import { RadioGroup, Radio } from 'react-mdl';
import Button from 'coral-ui/components/Button';
import { username as flagReason } from 'coral-framework/graphql/flagReasons';
import t from 'coral-framework/services/i18n';

const initialState = { reason: flagReason.offensive, message: '' };

class RejectUsernameDialog extends React.Component {
  state = initialState;

  componentWillReceiveProps(next) {
    if (this.props.open && !next.open) {
      this.setState(initialState);
    }
  }

  handleReasonChange = event => {
    this.setState({ reason: event.target.value });
  };

  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };

  handlePerform = () => {
    this.props.onPerform({
      reason: this.state.reason,
      message: this.state.message,
    });
  };

  render() {
    const { open, onCancel } = this.props;
    const { reason, message } = this.state;
    return (
      <Dialog
        className={cn(styles.dialog, 'talk-admin-reject-username-dialog')}
        id="rejectUsernameDialog"
        onCancel={onCancel}
        open={open}
      >
        <div className={styles.close}>
          <BareButton
            aria-label="Close"
            onClick={onCancel}
            className={styles.closeButton}
          >
            ×
          </BareButton>
        </div>
        <section className="talk-admin-reject-username-dialog-section">
          <h1 className={styles.header}>
            {t('reject_username_dialog.title')}: {this.props.username}
          </h1>
          <p className={styles.description}>
            {t('reject_username_dialog.description')}
          </p>
          <fieldset>
            <legend className={styles.legend}>
              {t('reject_username_dialog.reason')}
            </legend>
            <RadioGroup
              name="reason"
              value={reason}
              childContainer="div"
              onChange={this.handleReasonChange}
              className={styles.radioGroup}
            >
              <Radio value={flagReason.offensive}>
                {t('flag_reasons.username.offensive')}
              </Radio>
              <Radio value={flagReason.nolike}>
                {t('flag_reasons.username.nolike')}
              </Radio>
              <Radio value={flagReason.impersonating}>
                {t('flag_reasons.username.impersonating')}
              </Radio>
              <Radio value={flagReason.spam}>
                {t('flag_reasons.username.spam')}
              </Radio>
              <Radio value={flagReason.other}>
                {t('flag_reasons.username.other')}
              </Radio>
            </RadioGroup>
            {reason === flagReason.other && (
              <fieldset>
                <legend className={styles.legend}>
                  {t('reject_username_dialog.message')}
                </legend>
                <textarea
                  rows={5}
                  className={styles.messageInput}
                  value={message}
                  onChange={this.handleMessageChange}
                />
              </fieldset>
            )}
          </fieldset>
          <div className={styles.buttons}>
            <Button
              cStyle="white"
              className={styles.cancel}
              onClick={onCancel}
              raised
            >
              {t('reject_username_dialog.cancel')}
            </Button>
            <Button
              cStyle="black"
              className={cn(
                styles.perform,
                'talk-admin-reject-username-dialog-continue'
              )}
              onClick={this.handlePerform}
              raised
            >
              {t('reject_username_dialog.reject_username')}
            </Button>
          </div>
        </section>
      </Dialog>
    );
  }
}

RejectUsernameDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onPerform: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  username: PropTypes.string,
};

export default RejectUsernameDialog;
