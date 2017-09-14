import React from 'react';
import styles from './BanUserDialog.css';
import {t} from 'plugin-api/beta/client/services';
import {Dialog, Button} from 'plugin-api/beta/client/components/ui';

export default ({showDialog, closeDialog, banUser}) => (
  <Dialog open={showDialog} className={styles.dialog}>
    <h3>{t('talk-plugin-moderation-actions.ban_user_dialog_headline')}</h3>
    <p>
      {t('talk-plugin-moderation-actions.ban_user_dialog_copy')}
    </p>
    <div className={styles.buttons}>
      <Button cStyle="cancel" onClick={closeDialog} raised>
        {t('talk-plugin-moderation-actions.ban_user_dialog_cancel')}
      </Button>
      <Button cStyle="black" onClick={banUser} raised>
        {t('talk-plugin-moderation-actions.ban_user_dialog_yes')}
      </Button>
    </div>
  </Dialog>
);
