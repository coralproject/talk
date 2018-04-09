import React from 'react';
import PropTypes from 'prop-types';
import { Textfield } from 'react-mdl';
import styles from './OrganizationSettings.css';
import Slot from 'coral-framework/components/Slot';
import t from 'coral-framework/services/i18n';
import ConfigurePage from './ConfigurePage';
import ConfigureCard from 'coral-framework/components/ConfigureCard';

class OrganizationSettings extends React.Component {
  updateEmail = event => {
    const updater = { organizationContactEmail: { $set: event.target.value } };
    this.props.updatePending({ updater });
  };

  render() {
    const { settings, slotPassthrough } = this.props;

    return (
      <ConfigurePage title={t('configure.organization_information')}>
        <p>{t('configure.organization_info_copy')}</p>
        <p>{t('configure.organization_info_copy2')}</p>
        <ConfigureCard title={t('configure.organization_details')}>
          <ul>
            <li>
              {t('configure.organization_name')}: {settings.organizationName}
            </li>
            <li>
              {t('configure.organization_contact_email')}:{' '}
              <input
                defaultValue={settings.organizationContactEmail}
                readOnly
              />
            </li>
          </ul>
        </ConfigureCard>
        <ConfigureCard title={'Edit Organization Settings'}>
          <ul>
            <li>
              <label className={styles.label}>
                {t('configure.organization_contact_email')}
              </label>

              <Textfield
                type="text"
                onChange={this.updateEmail}
                value={settings.organizationContactEmail}
                label={t('configure.organizationContactEmail')}
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
