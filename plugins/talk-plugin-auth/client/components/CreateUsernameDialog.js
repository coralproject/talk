import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import {
  Dialog,
  Alert,
  TextField,
  Button,
} from 'plugin-api/beta/client/components/ui';
import { FakeComment } from './FakeComment';
import t from 'coral-framework/services/i18n';

const CreateUsernameDialog = ({
  open,
  handleClose,
  formData,
  handleSubmitUsername,
  handleChange,
  ...props
}) => (
  <Dialog
    className={styles.dialogusername}
    id="createUsernameDialog"
    open={open}
  >
    <span className={styles.close} onClick={handleClose}>
      ×
    </span>
    <div>
      <div className={styles.header}>
        <h1>{t('createdisplay.write_your_username')}</h1>
      </div>
      <div>
        <p className={styles.yourusername}>
          {t('createdisplay.your_username')}
        </p>
        <FakeComment
          className={styles.fakeComment}
          username={formData.username}
          created_at={new Date().toISOString()}
          body={t('createdisplay.fake_comment_body')}
        />
        <p className={styles.ifyoudont}>
          {t('createdisplay.if_you_dont_change_your_name')}
        </p>
        {props.auth.error && <Alert>{props.auth.error}</Alert>}
        <form id="saveUsername" onSubmit={handleSubmitUsername}>
          {props.errors.username && (
            <span className={styles.hint}>
              {' '}
              {t('createdisplay.special_characters')}{' '}
            </span>
          )}
          <div className={styles.saveusername}>
            <TextField
              id="username"
              style={{ fontSize: 16 }}
              type="string"
              label={t('createdisplay.username')}
              value={formData.username}
              onChange={handleChange}
            />
            <Button id="save" type="submit" className={styles.saveButton}>
              {t('createdisplay.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Dialog>
);

CreateUsernameDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  formData: PropTypes.object,
  handleSubmitUsername: PropTypes.func,
  handleChange: PropTypes.func,
  auth: PropTypes.object,
  errors: PropTypes.object,
};

export default CreateUsernameDialog;
