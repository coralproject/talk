import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'coral-ui';
import Domainlist from './Domainlist';
import EmbedLink from './EmbedLink';
import styles from './Configure.css';
import t from 'coral-framework/services/i18n';

const updateCustomCssUrl = (updateSettings) => (event) => {
  const customCssUrl = event.target.value;
  updateSettings({customCssUrl});
};

const TechSettings = ({settings, onChangeDomainlist, updateSettings}) => {
  return (
    <div className={styles.Configure}>
      <Domainlist
        domains={settings.domains.whitelist}
        onChangeDomainlist={onChangeDomainlist} />
      <EmbedLink />
      <Card className={styles.configSetting}>
        <div className={styles.wrapper}>
          <div className={styles.settingsHeader}>{t('configure.custom_css_url')}</div>
          <p>{t('configure.custom_css_url_desc')}</p>
          <input
            className={styles.customCSSInput}
            value={settings.customCssUrl}
            onChange={updateCustomCssUrl(updateSettings)} />
        </div>
      </Card>
    </div>
  );
};

TechSettings.propTypes = {
  settings: PropTypes.shape({
    domains: PropTypes.shape({
      whitelist: PropTypes.array.isRequired
    })
  }).isRequired,
  updateSettings: PropTypes.func.isRequired
};

export default TechSettings;
