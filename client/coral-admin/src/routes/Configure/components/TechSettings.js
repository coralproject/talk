import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'coral-ui';
import Domainlist from './Domainlist';
import EmbedLink from './EmbedLink';
import styles from './Configure.css';
import t from 'coral-framework/services/i18n';

class TechSettings extends React.Component {

  updateCustomCssUrl = (event) => {
    const updater = {customCssUrl: {$set: event.target.value}};
    this.props.updatePending({updater});
  };

  updateDomainlist = (listName, list) => {
    this.props.updatePending({updater: {
      domains: {$apply: (domains) => {
        const changeSet = {[listName]: list};
        if (!domains) {
          return changeSet;
        }
        return {
          ...domains,
          ...changeSet,
        };
      }},
    }});
  };

  render() {
    const {settings} = this.props;
    return (
      <div className={styles.Configure}>
        <h3>{t('configure.tech_settings')}</h3>
        <Domainlist
          domains={settings.domains.whitelist}
          onChangeDomainlist={this.updateDomainlist} />
        <EmbedLink />
        <Card className={styles.configSetting}>
          <div className={styles.wrapper}>
            <div className={styles.settingsHeader}>{t('configure.custom_css_url')}</div>
            <p>{t('configure.custom_css_url_desc')}</p>
            <input
              className={styles.customCSSInput}
              value={settings.customCssUrl}
              onChange={this.updateCustomCssUrl} />
          </div>
        </Card>
      </div>
    );
  }
}

TechSettings.propTypes = {
  updatePending: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
};

export default TechSettings;
