import React, {Component, PropTypes} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
const lang = new I18n(translations);
import styles from './RestrictedContent.css';
import {Button} from 'coral-ui';
import validate from '../helpers/validate';

class SuspendedAccount extends Component {

  static propTypes = {
    canEditName: PropTypes.bool,
    editName: PropTypes.func.isRequired
  }

  state = {
    displayName: '',
    alert: ''
  }

  onSubmitClick = (e) => {
    const {editName} = this.props;
    const {displayName} = this.state;
    e.preventDefault();
    if (validate.displayName(displayName)) {
      editName(displayName)
        .then(() => window.reload())
        .catch((error) => {
          this.setState({alert: lang.t(`error.${error.message}`)});
        });
    } else {
      this.setState({alert: lang.t('editName.error')});
    }

  }

  render () {
    const {canEditName} = this.props;
    const {displayName, alert} = this.state;

    return <div className={styles.message}>
      <span>{
          canEditName ?
          lang.t('editName.msg')
          : lang.t('bannedAccountMsg')
        }</span>
      {
        canEditName ?
        <div>
          <div className={styles.alert}>
            {alert}
          </div>
          <label
            htmlFor='displayName'
            className="screen-reader-text"
            aria-hidden={true}>
            {lang.t('editName.label')}
          </label>
          <input
            type='text'
            className={styles.editNameInput}
            value={displayName}
            placeholder={lang.t('editName.label')}
            id='displayName'
            onChange={(e) => this.setState({displayName: e.target.value})}
            rows={3}/><br/>
          <Button
            onClick={this.onSubmitClick}>
            {
              lang.t('editName.button')
            }
          </Button>
        </div> : null
      }
    </div>;
  }
}

export default SuspendedAccount;
