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

  updateName = event => {
    const updater = { organizationName: { $set: event.target.value } };
    this.props.updatePending({ updater });
  };

  updateEmail = event => {
    const updater = { organizationContactEmail: { $set: event.target.value } };
    this.props.updatePending({ updater });
  };

  render() {
    const { settings, slotPassthrough } = this.props;
    return (
      <ConfigurePage title={t('configure.organization_information')}>
        <p>{t('configure.organization_info_copy')}</p>
        <p>{t('configure.organization_info_copy_2')}</p>
        <ConfigureCard>
          {!this.state.editing ? (
            <Button
              className={styles.editButton}
              icon="settings"
              onClick={this.toggleEditing}
            >
              Edit Info
            </Button>
          ) : (
            <div className={styles.actionBox}>
              <Button icon="done" onClick={this.toggleEditing}>
                Save
              </Button>
              <a className={styles.cancelButton}>Cancel</a>
            </div>
          )}

          {console.log(this.props.slotPassthrough)}

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
  updatePending: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  slotPassthrough: PropTypes.object.isRequired,
};

export default OrganizationSettings;
