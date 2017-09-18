import React from 'react';
import styles from './BanUserDialog.css';
import {t} from 'plugin-api/beta/client/services';
import {Dialog, Button} from 'plugin-api/beta/client/components/ui';

export default ({showBanDialog, closeBanDialog, banUser}) => (
  <Dialog open={showBanDialog} className={styles.dialog}>
    <span className={styles.close} onClick={closeBanDialog}>×</span>
    <h3>{t('talk-plugin-moderation-actions.ban_user_dialog_headline')}</h3>
    <p>
      {t('talk-plugin-moderation-actions.ban_user_dialog_copy')}
    </p>
    <div className={styles.buttons}>
      <Button cStyle="cancel" onClick={closeBanDialog} raised>
        {t('talk-plugin-moderation-actions.ban_user_dialog_cancel')}
      </Button>
      <Button cStyle="black" onClick={banUser} raised>
        {t('talk-plugin-moderation-actions.ban_user_dialog_yes')}
      </Button>
    </div>
  </Dialog>
);
