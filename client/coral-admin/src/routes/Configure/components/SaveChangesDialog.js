import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button, Dialog } from 'coral-ui';
import styles from './SaveChangesDialog.css';
import t from 'coral-framework/services/i18n';

const SaveChangesDialog = ({
  saveDialog,
  hideSaveDialog,
  saveChanges,
  discardChanges,
}) => (
  <Dialog
    className={cn(styles.dialog, 'talk-admin-configure-save-dialog')}
    id="saveDialog"
    open={saveDialog}
    onCancel={hideSaveDialog}
    title={t('configure.unsaved_changes')}
  >
    <span className={styles.close} onClick={hideSaveDialog}>
      ×
    </span>
    {t('configure.save_dialog_copy')}
    <div
      className={cn(
        styles.buttonActions,
        'talk-admin-configure-save-dialog-button-actions'
      )}
    >
      <Button onClick={saveChanges} cStyle="green">
        {t('configure.save_settings')}
      </Button>
      <Button onClick={discardChanges}>{t('configure.discard_changes')}</Button>
    </div>
  </Dialog>
);

SaveChangesDialog.propTypes = {
  saveDialog: PropTypes.bool.isRequired,
  hideSaveDialog: PropTypes.func.isRequired,
  saveChanges: PropTypes.func.isRequired,
  discardChanges: PropTypes.func.isRequired,
};

export default SaveChangesDialog;
