import React from 'react';
import TextField from 'coral-ui/components/TextField';
import Button from 'coral-ui/components/Button';
import {Dialog, Alert} from 'coral-ui';
import FakeComment from './FakeComment';

import styles from './styles.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations';
const lang = new I18n(translations);

const CreateUsernameDialog = ({open, handleClose, offset, formData, handleSubmitUsername, handleChange, ...props}) => {
  return (
  <Dialog
    className={styles.dialogusername}
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
        <p className={styles.yourusername}>{lang.t('createdisplay.yourusername')}</p>
        <FakeComment
          className={styles.fakeComment}
          username={formData.username}
          created_at={Date.now()}
          body={lang.t('createdisplay.fakecommentbody')}
        />
        <p className={styles.ifyoudont}>{lang.t('createdisplay.ifyoudontchangeyourname')}</p>
        { props.auth.error && <Alert>{props.auth.error}</Alert> }
        <form id="saveUsername" onSubmit={handleSubmitUsername}>
          { props.errors.username && <span className={styles.hint}> {lang.t('createdisplay.specialCharacters')} </span> }
          <div className={styles.saveusername}>
            <TextField
              id="username"
              type="string"
              label={lang.t('createdisplay.username')}
              value={formData.username}
              onChange={handleChange}
            />
            <Button id="save" type="submit" className={styles.saveButton}>{lang.t('createdisplay.save')}</Button>
          </div>
      </form>
      </div>
    </div>
  </Dialog>
  );
};

export default CreateUsernameDialog;
