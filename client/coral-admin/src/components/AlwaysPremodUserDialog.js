import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Dialog } from 'coral-ui';
import styles from './AlwaysPremodUserDialog.css';

import Button from 'coral-ui/components/Button';
import t from 'coral-framework/services/i18n';

class AlwaysPremodUserDialog extends React.Component {
  handlePerform = () => {
    this.props.onPerform();
  };

  render() {
    const { open, onCancel, username, info } = this.props;
    return (
      <Dialog
        className={cn(styles.dialog, 'talk-always-premod-user-dialog')}
        id="alwaysPremodUserDialog"
        open={open}
        onCancel={onCancel}
        title={t('alwayspremoddialog.always_premod_user')}
      >
        <span className={styles.close} onClick={onCancel}>
          ×
        </span>
        <section>
          <h2 className={styles.header}>
            {t('alwayspremoddialog.always_premod_user')}
          </h2>
          <h3 className={styles.subheader}>
            {t('alwayspremoddialog.are_you_sure', username)}
          </h3>
          <p className={styles.description}>{info}</p>
          <div className={styles.buttons}>
            <Button
              className={cn('talk-always-premod-user-dialog-button-cancel')}
              cStyle="white"
              onClick={onCancel}
              raised
            >
              {t('alwayspremoddialog.cancel')}
            </Button>
            <Button
              className={cn('talk-always-premod-user-dialog-button-confirm')}
              cStyle="black"
              onClick={this.handlePerform}
              raised
            >
              {t('alwayspremoddialog.yes_always_premod_user')}
            </Button>
          </div>
        </section>
      </Dialog>
    );
  }
}

AlwaysPremodUserDialog.propTypes = {
  open: PropTypes.bool,
  onPerform: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  username: PropTypes.string,
  info: PropTypes.string,
};

export default AlwaysPremodUserDialog;
