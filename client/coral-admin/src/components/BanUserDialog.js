import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import {Dialog} from 'coral-ui';
import styles from './BanUserDialog.css';

import Button from 'coral-ui/components/Button';
import t from 'coral-framework/services/i18n';

const BanUserDialog = ({open, onCancel, onPerform, username, info}) => (
  <Dialog
    className={cn(styles.dialog, 'talk-ban-user-dialog')}
    id="banUserDialog"
    open={open}
    onCancel={onCancel}
    title={t('bandialog.ban_user')}>
    <span className={styles.close} onClick={onCancel}>×</span>
    <div className={styles.header}>
      <h2>{t('bandialog.ban_user')}</h2>
    </div>
    <div className={styles.separator}>
      <h3>{t('bandialog.are_you_sure', username)}</h3>
      <i>{info}</i>
    </div>
    <div className={styles.buttons}>
      <Button
        className={cn(styles.cancel, 'talk-ban-user-dialog-button-cancel')}
        cStyle="cancel"
        onClick={onCancel}
        raised >
        {t('bandialog.cancel')}
      </Button>
      <Button 
        className={cn(styles.ban, 'talk-ban-user-dialog-button-confirm')}
        cStyle="black"
        onClick={onPerform}
        raised >
        {t('bandialog.yes_ban_user')}
      </Button>
    </div>
  </Dialog>
);

BanUserDialog.propTypes = {
  open: PropTypes.bool,
  onPerform: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  username: PropTypes.string,
  info: PropTypes.string,
};

export default BanUserDialog;
