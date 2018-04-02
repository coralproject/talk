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
  >
    <span className={styles.close} onClick={hideSaveDialog}>
      ×
    </span>
    <div className={styles.title}>
      {t('configure.save_changes_dialog.unsaved_changes')}
    </div>
    {t('configure.save_changes_dialog.copy')}
    <div
      className={cn(
        styles.buttonActions,
        'talk-admin-configure-save-dialog-button-actions'
      )}
    >
      <a className={styles.cancel} onClick={hideSaveDialog}>
        Cancel
      </a>
      <Button onClick={discardChanges} className={styles.button}>
        {t('configure.save_changes_dialog.discard')}
      </Button>
      <Button onClick={saveChanges} cStyle="green" className={styles.button}>
        {t('configure.save_changes_dialog.save_settings')}
      </Button>
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
