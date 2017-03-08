import React, {PropTypes} from 'react';
import {Dialog} from 'coral-ui';
import styles from './BanUserDialog.css';

import Button from 'coral-ui/components/Button';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const BanUserDialog = ({open, handleClose, handleBanUser, user, showRejectedNote}) => (
  <Dialog
    className={styles.dialog}
    id="banuserDialog"
    open={open}
    onClose={handleClose}
    onCancel={handleClose}
    title={lang.t('bandialog.ban_user')}>
    <span className={styles.close} onClick={handleClose}>×</span>
    <div>
      <div className={styles.header}>
        <h2>{lang.t('bandialog.ban_user')}</h2>
      </div>
      <div className={styles.separator}>
        <h3>{lang.t('bandialog.are_you_sure', user.name)}</h3>
        <i>{showRejectedNote && lang.t('bandialog.note')}</i>
      </div>
      <div className={styles.buttons}>
        <Button cStyle="cancel" className={styles.cancel} onClick={handleClose} raised>
          {lang.t('bandialog.cancel')}
        </Button>
        <Button cStyle="black" className={styles.ban} onClick={() => handleBanUser({userId: user.id})} raised>
          {lang.t('bandialog.yes_ban_user')}
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
