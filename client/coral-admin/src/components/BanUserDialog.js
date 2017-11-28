import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import {Dialog} from 'coral-ui';
import styles from './BanUserDialog.css';

import Button from 'coral-ui/components/Button';
import t from 'coral-framework/services/i18n';

const initialState = {step: 0, message: ''};

class BanUserDialog extends React.Component {
  
  state = initialState;

  handleMessageChange = (e) => {
    const {value: message} = e; 
    this.setState({message});
  }

  goToStep = (step) => {
    this.setState({step});
  }

  renderStep0() {
    const {
      onCancel,
      username,
      info,
    } = this.props;

    return (
      <div>
        <div className={styles.header}>
          <h2>{t('bandialog.ban_user')}</h2>
        </div>
        <div className={styles.separator}>
          <h3>{t('bandialog.are_you_sure', username)}</h3>
          <p>{info}</p>
        </div>
        <div className={styles.buttons}>
          <Button
            className={cn('talk-ban-user-dialog-button-cancel')}
            cStyle="cancel"
            onClick={onCancel}
            raised >
            {t('bandialog.cancel')}
          </Button>
          <Button 
            className={cn('talk-ban-user-dialog-button-confirm')}
            cStyle="black"
            onClick={() => this.goToStep(1)}
            raised >
            {t('bandialog.yes_ban_user')}
          </Button>
        </div>
      </div>
    );
  }

  renderStep1() {
    const {
      onCancel,
      onPerform,
      handleMessageChange,
    } = this.props;
    const {message} = this.state;

    return (
      <div>
        <h2>Notify the user of ban</h2>
        <p>This will notify the user by email that they have been banned from the community</p>
        <fieldset>
          <legend className={styles.legend}>{t('bandialog.write_a_message')}</legend>
          <textarea
          rows={5}
          className={styles.messageInput}
          value={message}
          onChange={this.handleMessageChange} />
        </fieldset>
        <Button
          className={cn('talk-ban-user-dialog-button-cancel')}
          cStyle="cancel"
          onClick={onCancel}
          raised >
          {t('bandialog.cancel')}
        </Button>
        <Button 
          className={cn('talk-ban-user-dialog-button-confirm')}
          cStyle="black"
          onClick={onPerform}
          raised >
          {t('bandialog.send')}
        </Button>
      </div>
    )
  }

  render() {
    const {step} = this.state;
    const {open, onCancel} = this.props;
    return (
      <Dialog
      className={cn(styles.dialog, 'talk-ban-user-dialog')}
      id="banUserDialog"
      open={open}
      onCancel={onCancel}
      title={t('bandialog.ban_user')}>
        <span className={styles.close} onClick={onCancel}>×</span>
        {step === 0 && this.renderStep0()}
        {step === 1 && this.renderStep1()}
      </Dialog>
    )
  }
 };

BanUserDialog.propTypes = {
  open: PropTypes.bool,
  onPerform: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  username: PropTypes.string,
  info: PropTypes.string,
};

export default BanUserDialog;
