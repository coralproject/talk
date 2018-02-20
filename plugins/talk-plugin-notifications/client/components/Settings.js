import React from 'react';
import PropTypes from 'prop-types';
import { IfSlotIsNotEmpty } from 'plugin-api/beta/client/components';
import { Slot } from 'plugin-api/beta/client/components';
import { t } from 'plugin-api/beta/client/services';
import styles from './Settings.css';

class Settings extends React.Component {
  render() {
    const { root } = this.props;
    return (
      <IfSlotIsNotEmpty slot="notificationSettings" queryData={{ root }}>
        <div>
          <h3>{t('talk-plugin-notifications.settings_title')}</h3>
          <h4 className={styles.subtitle}>
            {t('talk-plugin-notifications.settings_subtitle')}
          </h4>
          <div className={styles.innerSettings}>
            <Slot fill="notificationSettings" queryData={{ root }} />
          </div>
        </div>
      </IfSlotIsNotEmpty>
    );
  }
}

Settings.propTypes = {
  root: PropTypes.object,
};

export default Settings;
