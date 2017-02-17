import React from 'react';
import TextField from 'coral-ui/components/TextField';
import Alert from './Alert';
import Button from 'coral-ui/components/Button';
import {Dialog} from 'coral-ui';
import styles from './styles.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const CreateUsernameDialog = ({open, handleClose, offset, formData, handleSubmitUsername, handleChange, ...props}) => (
  <Dialog
    className={styles.dialog}
    id="createUsernameDialog"
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
        <label htmlFor="username">{lang.t('createdisplay.yourusername')}</label>
        { props.auth.error && <Alert>{props.auth.error}</Alert> }
        <form id="saveUsername" onSubmit={handleSubmitUsername}>
          <TextField
            id="username"
            type="string"
            label={lang.t('createdisplay.username')}
            value={formData.username}
            onChange={handleChange}
          />
        { props.errors.username && <span className={styles.hint}> {lang.t('createdisplay.specialCharacters')} </span> }
          <div className={styles.action}>
            <Button id="save" type="submit" className={styles.saveButton}>{lang.t('createdisplay.save')}</Button>
          </div>
      </form>
      </div>
    </div>
  </Dialog>
);

export default CreateUsernameDialog;
