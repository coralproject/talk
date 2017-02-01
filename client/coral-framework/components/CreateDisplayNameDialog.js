import React from 'react';
import FormField from './FormField';
import Alert from './Alert';
import Button from 'coral-ui/components/Button';
import {Dialog} from 'coral-ui';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const CreateDisplayNameDialog = ({open, handleClose, offset, formData, handleSubmitDisplayName, handleChange, ...props}) => (
  <Dialog
    className={styles.dialog}
    id="createDisplayNameDialog"
    open={open}
    style={{
      position: 'relative',
      top: offset !== 0 && offset
    }}>
    <span className={styles.close} onClick={handleClose}>×</span>
    <div>
      <div className={styles.header}>
        <h1>
          {lang.t('createdisplay.writeyourusername')}
        </h1>
      </div>
      <div>
        <p>{lang.t('createdisplay.yourusername')}</p>
        { props.auth.error && <Alert>{props.auth.error}</Alert> }
        <form id="saveDisplayName" onSubmit={handleSubmitDisplayName}>
          <FormField
            id="displayName"
            type="string"
            label={lang.t('createdisplay.displayName')}
            value={formData.displayName}
            onChange={handleChange}
          />
          { props.errors.displayName && <span className={styles.hint}> {lang.t('createdisplay.specialCharacters')} </span> }
          <div className={styles.action}>
            <Button id="save" type="submit" className={styles.saveButton}>{lang.t('createdisplay.save')}</Button>
          </div>
      </form>
      </div>
    </div>
  </Dialog>
);

export default CreateDisplayNameDialog;
