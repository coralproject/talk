import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './BanUserDialog.css';
import { t } from 'plugin-api/beta/client/services';
import { Dialog, Button } from 'plugin-api/beta/client/components/ui';

const BanUserDialog = ({ showBanDialog, closeBanDialog, banUser }) => (
  <Dialog
    open={showBanDialog}
    className={cn(styles.dialog, 'talk-ban-user-dialog')}
  >
    <span className={styles.close} onClick={closeBanDialog}>
      ×
    </span>
    <h2>{t('talk-plugin-moderation-actions.ban_user_dialog_headline')}</h2>
    <h3>{t('talk-plugin-moderation-actions.ban_user_dialog_sub')}</h3>
    <p className={styles.copy}>
      {t('talk-plugin-moderation-actions.ban_user_dialog_copy')}
    </p>
    <div className={styles.buttons}>
      <Button
        cStyle="cancel"
        onClick={closeBanDialog}
        className={cn(styles.cancel, 'talk-ban-user-dialog-button-cancel')}
        raised
      >
        {t('talk-plugin-moderation-actions.ban_user_dialog_cancel')}
      </Button>
      <Button
        cStyle="black"
        onClick={banUser}
        className={cn(styles.confirm, 'talk-ban-user-dialog-button-confirm')}
        raised
      >
        {t('talk-plugin-moderation-actions.ban_user_dialog_yes')}
      </Button>
    </div>
  </Dialog>
);

BanUserDialog.propTypes = {
  showBanDialog: PropTypes.bool.isRequired,
  closeBanDialog: PropTypes.func.isRequired,
  banUser: PropTypes.func.isRequired,
};

export default BanUserDialog;
