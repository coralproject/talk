import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './ChangeUsername.css';
import { Button } from 'plugin-api/beta/client/components/ui';

const initialState = {
  editing: false,
};

class ChangeUsername extends React.Component {
  state = initialState;

  render() {
    const { username, emailAddress } = this.props;
    return (
      <section className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.username}>{username}</h2>
          {emailAddress ? <p className={styles.email}>{emailAddress}</p> : null}
        </div>
        <div className={styles.actions}>
          <Button
            className={cn(styles.button, styles.saveButton)}
            icon="save"
            onClick={this.onSave}
            disabled={this.isSubmitBlocked()}
          >
            Save
          </Button>
          <a className={styles.cancelButton} onClick={this.cancel}>
            Cancel
          </a>
        </div>
        <div className={styles.actions}>
          <Button className={styles.button} onClick={this.enableEditing}>
            Edit
          </Button>
        </div>
      </section>
    );
  }
}

ChangeUsername.propTypes = {
  changeUsername: PropTypes.func.isRequired,
  username: PropTypes.string,
  emailAddress: PropTypes.string,
};

export default ChangeUsername;
