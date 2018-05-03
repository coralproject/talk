import React from 'react';
import cn from 'classnames';
import { Button } from 'coral-ui';
import PropTypes from 'prop-types';
import styles from './OrganizationSettings.css';
import Slot from 'coral-framework/components/Slot';
import t from 'coral-framework/services/i18n';
import ConfigurePage from './ConfigurePage';
import ConfigureCard from 'coral-framework/components/ConfigureCard';
import validate from 'coral-framework/helpers/validate';
import errorMsj from 'coral-framework/helpers/error';

class OrganizationSettings extends React.Component {
  state = { editing: false, errors: [] };

  addError = err => {
    if (this.state.errors.indexOf(err) === -1) {
      this.setState(({ errors }) => ({
        errors: errors.concat(err),
      }));
    }
  };

  removeError = err => {
    this.setState(({ errors }) => ({
      errors: errors.filter(i => i !== err),
    }));
  };

  toggleEditing = () => {
    this.setState(({ editing }) => ({
      editing: !editing,
    }));
  };

  disableEditing = () => {
    this.setState(() => ({
      editing: false,
    }));
  };

  updateName = event => {
    const updater = { organizationName: { $set: event.target.value } };
    this.props.updatePending({ updater });
  };

  updateEmail = event => {
    let error = null;
    const email = event.target.value;

    // Add a blocker error
    if (!validate.email(email)) {
      error = true;
      this.addError('email');
    } else {
      this.removeError('email');
    }

    const updater = { organizationContactEmail: { $set: email } };
    const errorUpdater = { organizationContactEmail: { $set: error } };

    this.props.updatePending({ updater, errorUpdater });
  };

  cancelEditing = () => {
    this.disableEditing();
    this.props.clearPending();
  };

  save = async () => {
    await this.props.savePending();
    this.disableEditing();
  };
  displayErrors = (errors = []) => (
    <ul className={styles.errorList}>
      {errors.map((errKey, i) => (
        <li key={`${i}_${errKey}`} className={styles.errorItem}>
          {errorMsj[errKey]}
        </li>
      ))}
    </ul>
  );

  render() {
    const { settings, slotPassthrough, canSave } = this.props;
    const hasErrors = this.state.errors.length;
    return (
      <ConfigurePage title={t('configure.organization_information')}>
        <p>{t('configure.organization_info_copy')}</p>
        <p>{t('configure.organization_info_copy_2')}</p>
        <ConfigureCard>
          <div className={styles.container}>
            <div className={styles.content}>
              {this.displayErrors(this.state.errors)}
              <ul className={styles.detailList}>
                <li className={styles.detailItem}>
                  <label
                    className={styles.detailLabel}
                    id={t('configure.organization_name')}
                  >
                    {t('configure.organization_name')}
                  </label>
                  <input
                    type="text"
                    className={cn(styles.detailValue, {
                      [styles.editable]: this.state.editing,
                    })}
                    onChange={this.updateName}
                    value={settings.organizationName}
                    id={t('configure.organization_name')}
                    readOnly={!this.state.editing}
                  />
                </li>
                <li className={styles.detailItem}>
                  <label
                    className={styles.detailLabel}
                    id={t('configure.organization_contact_email')}
                  >
                    {t('configure.organization_contact_email')}
                  </label>
                  <input
                    type="text"
                    className={cn(styles.detailValue, {
                      [styles.editable]: this.state.editing,
                    })}
                    onChange={this.updateEmail}
                    value={settings.organizationContactEmail || ''}
                    id={t('configure.organization_contact_email')}
                    readOnly={!this.state.editing}
                  />
                </li>
              </ul>
            </div>
            {!this.state.editing ? (
              <div className={styles.actionBox}>
                <Button
                  className={styles.button}
                  icon="settings"
                  onClick={this.toggleEditing}
                  full
                >
                  {t('configure.edit_info')}
                </Button>
              </div>
            ) : (
              <div className={styles.actionBox}>
                {canSave && !hasErrors ? (
                  <Button
                    raised
                    onClick={this.save}
                    className={styles.changedSave}
                    icon="check"
                    full
                  >
                    {t('configure.save')}
                  </Button>
                ) : (
                  <Button className={styles.button} disabled icon="check" full>
                    {t('configure.save')}
                  </Button>
                )}
                <a className={styles.cancelButton} onClick={this.cancelEditing}>
                  {t('cancel')}
                </a>
              </div>
            )}
          </div>
        </ConfigureCard>
        <Slot fill="adminOrganizationSettings" passthrough={slotPassthrough} />
      </ConfigurePage>
    );
  }
}

OrganizationSettings.propTypes = {
  savePending: PropTypes.func.isRequired,
  clearPending: PropTypes.func.isRequired,
  updatePending: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  slotPassthrough: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
};

export default OrganizationSettings;
