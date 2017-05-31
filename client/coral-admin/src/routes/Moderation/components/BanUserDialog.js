import React, {PropTypes} from 'react';
import {Dialog} from 'coral-ui';
import styles from './BanUserDialog.css';

import Button from 'coral-ui/components/Button';
import t from 'coral-framework/services/i18n';

const onBanClick = (userId, commentId, commentStatus, handleBanUser, rejectComment, handleClose) => (e) => {
  e.preventDefault();
  handleBanUser({userId})
  .then(handleClose)
  .then(() => commentStatus === 'REJECTED' ? null : rejectComment({commentId}));
};

const BanUserDialog = ({open, handleClose, handleBanUser, rejectComment, user, commentId, commentStatus, showRejectedNote}) => (
  <Dialog
    className={styles.dialog}
    id="banuserDialog"
    open={open}
    onClose={handleClose}
    onCancel={handleClose}
    title={t('bandialog.ban_user')}>
    <span className={styles.close} onClick={handleClose}>×</span>
    <div>
      <div className={styles.header}>
        <h2>{t('bandialog.ban_user')}</h2>
      </div>
      <div className={styles.separator}>
        <h3>{t('bandialog.are_you_sure', user.name)}</h3>
        <i>{showRejectedNote && t('bandialog.note')}</i>
      </div>
      <div className={styles.buttons}>
        <Button cStyle="cancel" className={styles.cancel} onClick={handleClose} raised>
          {t('bandialog.cancel')}
        </Button>
        <Button cStyle="black" className={styles.ban} onClick={onBanClick(user.id, commentId, commentStatus, handleBanUser, rejectComment, handleClose)} raised>
          {t('bandialog.yes_ban_user')}
        </Button>
      </div>
    </div>
  </Dialog>
);

BanUserDialog.propTypes = {
  handleBanUser: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  rejectComment: PropTypes.func.isRequired,
  commentId: PropTypes.string,
  user: PropTypes.object.isRequired,
};

export default BanUserDialog;
