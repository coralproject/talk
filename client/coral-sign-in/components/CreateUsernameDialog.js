import React from 'react';
import TextField from 'coral-ui/components/TextField';
import Button from 'coral-ui/components/Button';
import {Dialog, Alert} from 'coral-ui';
import FakeComment from './FakeComment';

import styles from './styles.css';

import I18n from 'coral-i18n/modules/i18n/i18n';

const lang = new I18n();

const CreateUsernameDialog = ({open, handleClose, formData, handleSubmitUsername, handleChange, ...props}) => {
  return (
  <Dialog
    className={styles.dialogusername}
    id="createUsernameDialog"
    open={open}>
    <span className={styles.close} onClick={handleClose}>×</span>
    <div>
      <div className={styles.header}>
        <h1>
          {lang.t('createdisplay.write_your_username')}
        </h1>
      </div>
      <div>
        <p className={styles.yourusername}>{lang.t('createdisplay.your_username')}</p>
        <FakeComment
          className={styles.fakeComment}
          username={formData.username}
          created_at={Date.now()}
          body={lang.t('createdisplay.fake_comment_body')}
        />
        <p className={styles.ifyoudont}>{lang.t('createdisplay.if_you_dont_change_your_name')}</p>
        { props.auth.error && <Alert>{props.auth.error}</Alert> }
        <form id="saveUsername" onSubmit={handleSubmitUsername}>
          { props.errors.username && <span className={styles.hint}> {lang.t('createdisplay.special_characters')} </span> }
          <div className={styles.saveusername}>
            <TextField
              id="username"
              style={{fontSize: 16}}
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
