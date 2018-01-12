import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'coral-ui';
import { RadioGroup, Radio } from 'react-mdl';
import styles from './SuspendUserDialog.css';
import cn from 'classnames';

import Button from 'coral-ui/components/Button';

import t, { timeago } from 'coral-framework/services/i18n';
import { dateAdd } from 'coral-framework/utils';

const initialState = { step: 0, duration: '3' };

function durationsToDate(hours) {
  // Add 1 minute more to help `timeago.js` to display the correct duration.
  return dateAdd(new Date(), 'minute', hours * 60 + 1);
}

class SuspendUserDialog extends React.Component {
  state = initialState;

  componentWillReceiveProps(next) {
    if (this.props.open && !next.open) {
      this.setState(initialState);
    }
  }

  handleDurationChange = event => {
    this.setState({ duration: event.target.value });
  };

  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };

  goToStep1 = () => {
    this.setState({
      step: 1,
      message: t(
        'suspenduser.email_message_suspend',
        this.props.username,
        this.props.organizationName,
        timeago(durationsToDate(this.state.duration))
      ),
    });
  };

  handlePerform = () => {
    this.props.onPerform({
      message: this.state.message,

      // Add 1 minute more to help `timeago.js` to display the correct duration.
      until: durationsToDate(this.state.duration),
    });
  };

  renderStep0() {
    const { onCancel, username } = this.props;
    const { duration } = this.state;
    return (
      <section className="talk-admin-suspend-user-dialog-step-0">
        <h1 className={styles.header}>{t('suspenduser.title_suspend')}</h1>
        <p className={styles.description}>
          {t('suspenduser.description_suspend', username)}
        </p>
        <fieldset>
          <legend className={styles.legend}>
            {t('suspenduser.select_duration')}
          </legend>
          <RadioGroup
            name="status filter"
            value={duration}
            childContainer="div"
            onChange={this.handleDurationChange}
            className={styles.radioGroup}
          >
            <Radio value="1">{t('suspenduser.one_hour')}</Radio>
            <Radio value="3">{t('suspenduser.hours', 3)}</Radio>
            <Radio value="24">{t('suspenduser.hours', 24)}</Radio>
            <Radio value="168">{t('suspenduser.days', 7)}</Radio>
          </RadioGroup>
        </fieldset>
        <div className={styles.buttons}>
          <Button
            cStyle="white"
            className={styles.cancel}
            onClick={onCancel}
            raised
          >
            {t('suspenduser.cancel')}
          </Button>
          <Button
            cStyle="black"
            className={cn(
              styles.perform,
              'talk-admin-suspend-user-dialog-confirm'
            )}
            onClick={this.goToStep1}
            raised
          >
            {t('suspenduser.suspend_user')}
          </Button>
        </div>
      </section>
    );
  }

  renderStep1() {
    const { message } = this.state;
    const { onCancel, username } = this.props;
    return (
      <section className="talk-admin-suspend-user-dialog-step-1">
        <h1 className={styles.header}>{t('suspenduser.title_notify')}</h1>
        <p className={styles.description}>
          {t('suspenduser.description_notify', username)}
        </p>
        <fieldset>
          <legend className={styles.legend}>
            {t('suspenduser.write_message')}
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
            cStyle="white"
            className={styles.cancel}
            onClick={onCancel}
            raised
          >
            {t('suspenduser.cancel')}
          </Button>
          <Button
            cStyle="black"
            className={cn(
              styles.perform,
              'talk-admin-suspend-user-dialog-send'
            )}
            onClick={this.handlePerform}
            disabled={this.state.message.length === 0}
            raised
          >
            {t('suspenduser.send')}
          </Button>
        </div>
      </section>
    );
  }

  render() {
    const { open, onCancel } = this.props;
    const { step } = this.state;
    return (
      <Dialog
        className={cn(styles.dialog, 'talk-admin-suspend-user-dialog')}
        onCancel={onCancel}
        open={open}
      >
        <div className={styles.close}>
          <button
            aria-label="Close"
            onClick={onCancel}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>
        {step === 0 && this.renderStep0()}
        {step === 1 && this.renderStep1()}
      </Dialog>
    );
  }
}

SuspendUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onPerform: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  organizationName: PropTypes.string,
  username: PropTypes.string,
};

export default SuspendUserDialog;
