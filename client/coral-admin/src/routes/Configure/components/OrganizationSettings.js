import React from 'react';
import cn from 'classnames';
import { Button } from 'coral-ui';
import PropTypes from 'prop-types';
import styles from './OrganizationSettings.css';
import Slot from 'coral-framework/components/Slot';
import t from 'coral-framework/services/i18n';
import ConfigurePage from './ConfigurePage';
import ConfigureCard from 'coral-framework/components/ConfigureCard';

class OrganizationSettings extends React.Component {
  state = { editing: false };

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
    const updater = { organizationContactEmail: { $set: event.target.value } };
    this.props.updatePending({ updater });
  };

  cancelEditing = () => {
    this.disableEditing();
    this.props.clearPending();
  };

  save = async () => {
    await this.props.savePending();
    this.disableEditing();
  };

  render() {
    const { settings, slotPassthrough, canSave } = this.props;
    return (
      <ConfigurePage title={t('configure.organization_information')}>
        <p>{t('configure.organization_info_copy')}</p>
        <p>{t('configure.organization_info_copy_2')}</p>
        <ConfigureCard>
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
              {canSave ? (
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
                value={settings.organizationContactEmail}
                id={t('configure.organization_contact_email')}
                readOnly={!this.state.editing}
              />
            </li>
          </ul>
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
