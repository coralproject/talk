import React, {Component, PropTypes} from 'react';

import t from 'coral-i18n/services/i18n';

import styles from './RestrictedContent.css';
import {Button} from 'coral-ui';

import validate from '../helpers/validate';

class SuspendedAccount extends Component {

  static propTypes = {
    canEditName: PropTypes.bool,
    editName: PropTypes.func.isRequired
  }

  state = {
    username: '',
    alert: ''
  }

  onSubmitClick = (e) => {
    const {editName} = this.props;
    const {username} = this.state;
    e.preventDefault();
    if (validate.username(username)) {
      editName(username)
        .then(() => location.reload())
        .catch((error) => {
          this.setState({alert: t(`error.${error.translation_key}`)});
        });
    } else {
      this.setState({alert: t('framework.edit_name.error')});
    }

  }

  render () {
    const {canEditName} = this.props;
    const {username, alert} = this.state;

    return <div className={styles.message}>
      <span>{
          canEditName ?
          t('framework.edit_name.msg')
          : t('framework.banned_account_msg')
        }</span>
      {
        canEditName ?
        <div>
          <div className={styles.alert}>
            {alert}
          </div>
          <label
            htmlFor='username'
            className="screen-reader-text"
            aria-hidden={true}>
            {t('framework.edit_name.label')}
          </label>
          <input
            type='text'
            className={styles.editNameInput}
            value={username}
            placeholder={t('framework.edit_name.label')}
            id='username'
            onChange={(e) => this.setState({username: e.target.value})}
            rows={3}/><br/>
          <Button
            onClick={this.onSubmitClick}>
            {
              t('framework.edit_name.button')
            }
          </Button>
        </div> : null
      }
    </div>;
  }
}

export default SuspendedAccount;
