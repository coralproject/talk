import React, {PropTypes} from 'react';
import {Card} from 'coral-ui';
import {Textfield} from 'react-mdl';
import Domainlist from './Domainlist';
import EmbedLink from './EmbedLink';
import styles from './Configure.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
const lang = new I18n(translations);

const updateCustomCssUrl = (updateSettings) => (event) => {
  const customCssUrl = event.target.value;
  updateSettings({customCssUrl});
};

const TechSettings = ({settings, onChangeDomainlist, updateSettings}) => {
  return (
    <div>
      <Domainlist
        domains={settings.domains.whitelist}
        onChangeDomainlist={onChangeDomainlist} />
      <EmbedLink />
      <Card className={styles.configSettingInfoBox}>
        <div className={styles.content}>
          {lang.t('configure.custom-css-url')}
          <p>{lang.t('configure.custom-css-url-desc')}</p>
          <br />
          <Textfield
            style={{width: '100%'}}
            label={lang.t('configure.custom-css-url')}
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
