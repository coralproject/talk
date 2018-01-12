import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';
import styles from './ChangeUsername.css';
import { Button } from 'coral-ui';
import validate from 'coral-framework/helpers/validate';
import RestrictedMessageBox from 'coral-framework/components/RestrictedMessageBox';
import { forEachError } from 'plugin-api/beta/client/utils';

class ChangeUsername extends Component {
  static propTypes = {
    changeUsername: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  state = {
    username: '',
    alert: '',
  };

  onSubmitClick = e => {
    const { changeUsername, user } = this.props;
    const { username } = this.state;
    e.preventDefault();

    if (username === this.props.user.username) {
      this.setState({ alert: t('error.SAME_USERNAME_PROVIDED') });
    } else if (validate.username(username)) {
      changeUsername(user.id, username)
        .then(() => location.reload())
        .catch(error => {
          let errorMsg = '';
          forEachError(
            error,
            ({ msg }) => (errorMsg = errorMsg ? `${errorMsg}, ${msg}` : msg)
          );
          this.setState({ alert: errorMsg });
        });
    } else {
      this.setState({ alert: t('framework.edit_name.error') });
    }
  };

  render() {
    const { username, alert } = this.state;

    return (
      <RestrictedMessageBox>
        <div className="talk-change-username">
          <span>{t('framework.edit_name.msg')}</span>
          <div className={styles.alert}>{alert}</div>
          <label htmlFor="username" className="screen-reader-text">
            {t('framework.edit_name.label')}
          </label>
          <input
            type="text"
            className={cn(
              styles.editNameInput,
              'talk-change-username-username-input'
            )}
            value={username}
            placeholder={t('framework.edit_name.label')}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <br />
          <Button
            className="talk-change-username-submit-button"
            onClick={this.onSubmitClick}
          >
            {t('framework.edit_name.button')}
          </Button>
        </div>
      </RestrictedMessageBox>
    );
  }
}

export default ChangeUsername;
