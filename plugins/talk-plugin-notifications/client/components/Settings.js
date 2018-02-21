import React from 'react';
import PropTypes from 'prop-types';
import { IfSlotIsNotEmpty } from 'plugin-api/beta/client/components';
import { Slot } from 'plugin-api/beta/client/components';
import { t } from 'plugin-api/beta/client/services';
import styles from './Settings.css';
import { BareButton } from 'plugin-api/beta/client/components/ui';

class Settings extends React.Component {
  childFactory = el => {
    const pluginName = el.type.talkPluginName;
    const props = {
      indicateOn: () => this.props.indicateOn(pluginName),
      indicateOff: () => this.props.indicateOff(pluginName),
    };
    return React.cloneElement(el, props);
  };

  render() {
    const {
      root,
      setTurnOffInputFragment,
      updateNotificationSettings,
      turnOffAll,
      turnOffButtonDisabled,
    } = this.props;

    return (
      <IfSlotIsNotEmpty slot="notificationSettings" queryData={{ root }}>
        <div>
          <h3>{t('talk-plugin-notifications.settings_title')}</h3>
          <h4 className={styles.subtitle}>
            {t('talk-plugin-notifications.settings_subtitle')}
          </h4>
          <div className={styles.innerSettings}>
            <Slot
              fill="notificationSettings"
              queryData={{ root }}
              childFactory={this.childFactory}
              setTurnOffInputFragment={setTurnOffInputFragment}
              updateNotificationSettings={updateNotificationSettings}
            />
            <BareButton onClick={turnOffAll} disabled={turnOffButtonDisabled}>
              {' '}
              Turn Off All{' '}
            </BareButton>
          </div>
        </div>
      </IfSlotIsNotEmpty>
    );
  }
}

Settings.propTypes = {
  root: PropTypes.object,
  indicateOn: PropTypes.func.isRequired,
  indicateOff: PropTypes.func.isRequired,
  setTurnOffInputFragment: PropTypes.func.isRequired,
  updateNotificationSettings: PropTypes.func.isRequired,
  turnOffAll: PropTypes.func.isRequired,
  turnOffButtonDisabled: PropTypes.bool.isRequired,
};

export default Settings;
