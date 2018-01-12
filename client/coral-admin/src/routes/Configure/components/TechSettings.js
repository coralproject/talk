import React from 'react';
import PropTypes from 'prop-types';
import Domainlist from './Domainlist';
import EmbedLink from './EmbedLink';
import styles from './TechSettings.css';
import Slot from 'coral-framework/components/Slot';
import t from 'coral-framework/services/i18n';
import ConfigurePage from './ConfigurePage';
import ConfigureCard from 'coral-framework/components/ConfigureCard';

class TechSettings extends React.Component {
  updateCustomCssUrl = event => {
    const updater = { customCssUrl: { $set: event.target.value } };
    this.props.updatePending({ updater });
  };

  updateDomainlist = (listName, list) => {
    this.props.updatePending({
      updater: {
        domains: {
          $apply: domains => {
            const changeSet = { [listName]: list };
            if (!domains) {
              return changeSet;
            }
            return {
              ...domains,
              ...changeSet,
            };
          },
        },
      },
    });
  };

  render() {
    const { settings, data, root, errors, updatePending } = this.props;
    return (
      <ConfigurePage title={t('configure.tech_settings')}>
        <Domainlist
          domains={settings.domains.whitelist}
          onChangeDomainlist={this.updateDomainlist}
        />
        <EmbedLink />
        <ConfigureCard title={t('configure.custom_css_url')}>
          <p>{t('configure.custom_css_url_desc')}</p>
          <input
            className={styles.customCSSInput}
            value={settings.customCssUrl}
            onChange={this.updateCustomCssUrl}
          />
        </ConfigureCard>
        <Slot
          fill="adminTechSettings"
          data={data}
          queryData={{ root, settings }}
          updatePending={updatePending}
          errors={errors}
        />
      </ConfigurePage>
    );
  }
}

TechSettings.propTypes = {
  updatePending: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
};

export default TechSettings;
