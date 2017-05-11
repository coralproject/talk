import React, {PropTypes} from 'react';
import {Dialog} from 'coral-ui';
import styles from './BanUserDialog.css';

import Button from 'coral-ui/components/Button';

import I18n from 'coral-i18n/modules/i18n/i18n';

const lang = new I18n();

const BanUserDialog = ({open, handleClose, handleBanUser, user}) => (
  <Dialog
    className={styles.dialog}
    id="banuserDialog"
    open={open}
    onClose={handleClose}
    onCancel={handleClose}
    title={lang.t('community.ban_user')}>
    <span className={styles.close} onClick={handleClose}>×</span>
    <div>
      <div className={styles.header}>
        <h2>{lang.t('community.ban_user')}</h2>
      </div>
      <div className={styles.separator}>
        <h3>{lang.t('community.are_you_sure', user.username)}</h3>
        <i>{lang.t('community.note')}</i>
      </div>
      <div className={styles.buttons}>
        <Button cStyle="cancel" className={styles.cancel} onClick={handleClose} raised>
          {lang.t('community.cancel')}
        </Button>
        <Button
          cStyle="black" className={styles.ban}
          onClick={() => {
            handleBanUser({userId: user.id}).then(() => {
              handleClose();
            });
          }}
          raised>
          {lang.t('community.yes_ban_user')}
        </Button>
      </div>
    </div>
  </Dialog>
);

BanUserDialog.propTypes = {
  handleBanUser: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default BanUserDialog;
