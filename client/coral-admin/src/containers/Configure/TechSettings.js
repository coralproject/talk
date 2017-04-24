import React, {PropTypes} from 'react';
import {Card} from 'coral-ui';
import Domainlist from './Domainlist';
import EmbedLink from './EmbedLink';
import styles from './Configure.css';
import I18n from 'coral-i18n/modules/i18n/i18n';
import translations from '../../translations.json';
const lang = new I18n(translations);

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
          <div className={styles.settingsHeader}>{lang.t('configure.custom-css-url')}</div>
          <p>{lang.t('configure.custom-css-url-desc')}</p>
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
