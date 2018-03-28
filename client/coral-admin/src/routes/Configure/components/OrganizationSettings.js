import React from 'react';
import PropTypes from 'prop-types';

import Slot from 'coral-framework/components/Slot';
import t from 'coral-framework/services/i18n';
import ConfigurePage from './ConfigurePage';
import ConfigureCard from 'coral-framework/components/ConfigureCard';

class OrganizationSettings extends React.Component {
  render() {
    const { settings, slotPassthrough } = this.props;
    console.log(this.props);
    return (
      <ConfigurePage title={t('configure.organization_settings')}>
        <ConfigureCard title={t('configure.organization_details')}>
          <ul>
            <li>
              {t('configure.organization_name')}: {settings.organizationName}
            </li>
            <li>
              {t('configure.organization_contact_email')}:{' '}
              {settings.organizationContactEmail}
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
