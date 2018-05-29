import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'coral-ui';
import styles from './SuspendUserDialog.css';
import cn from 'classnames';
import { RadioGroup, Radio } from 'react-mdl';
import Button from 'coral-ui/components/Button';
import { username as flagReason } from 'coral-framework/graphql/flagReasons';

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
          <button
            aria-label="Close"
            onClick={onCancel}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>
        <section className="talk-admin-reject-username-dialog-section">
          <h1 className={styles.header}>
            Reject Username: {this.props.username}
          </h1>
          <p className={styles.description}>Help us understand</p>
          <fieldset>
            <legend className={styles.legend}>Reason</legend>
            <RadioGroup
              name="reason"
              value={reason}
              childContainer="div"
              onChange={this.handleReasonChange}
              className={styles.radioGroup}
            >
              <Radio value={flagReason.offensive}>
                This username is offensive
              </Radio>
              <Radio value={flagReason.nolike}>I dont like this username</Radio>
              <Radio value={flagReason.impersonating}>
                This user is impersonating
              </Radio>
              <Radio value={flagReason.spam}>
                This looks like an ad/marketing
              </Radio>
              <Radio value={flagReason.other}>Other</Radio>
            </RadioGroup>
            {reason === flagReason.other && (
              <fieldset>
                <legend className={styles.legend}>
                  Reason for reporting (Optional)
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
              Cancel
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
              Reject Username
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
