import React from 'react';
import PropTypes from 'prop-types';
import styles from './SetUsernameDialog.css';
import {
  Dialog,
  Alert,
  TextField,
  Button,
} from 'plugin-api/beta/client/components/ui';
import { FakeComment } from './FakeComment';
import { t } from 'plugin-api/beta/client/services';

class SetUsernameDialog extends React.Component {
  handleUsernameChange = e => this.props.onUsernameChange(e.target.value);

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const { username, usernameError, errorMessage } = this.props;

    return (
      <Dialog className={styles.dialogusername} id="createUsernameDialog" open>
        <div>
          <div className={styles.header}>
            <h1>
              {t('talk-plugin-auth.set_username_dialog.write_your_username')}
            </h1>
          </div>
          <div>
            <p className={styles.yourusername}>
              {t('talk-plugin-auth.set_username_dialog.your_username')}
            </p>
            <FakeComment
              className={styles.fakeComment}
              username={username}
              created_at={new Date().toISOString()}
              body={t('talk-plugin-auth.set_username_dialog.fake_comment_body')}
            />
            {errorMessage && <Alert>{errorMessage}</Alert>}
            <form id="saveUsername" onSubmit={this.handleSubmit}>
              {usernameError && (
                <span className={styles.hint}>
                  {' '}
                  {t(
                    'talk-plugin-auth.set_username_dialog.special_characters'
                  )}{' '}
                </span>
              )}
              <div className={styles.saveusername}>
                <TextField
                  id="username"
                  style={{ fontSize: 16 }}
                  type="string"
                  label={t('talk-plugin-auth.set_username_dialog.username')}
                  value={username}
                  showErrors={!!usernameError}
                  errorMsg={usernameError}
                  onChange={this.handleUsernameChange}
                />
                <Button id="save" type="submit" className={styles.saveButton}>
                  {t('talk-plugin-auth.set_username_dialog.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    );
  }
}

SetUsernameDialog.propTypes = {
  loading: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  usernameError: PropTypes.string,
  onUsernameChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

export default SetUsernameDialog;
