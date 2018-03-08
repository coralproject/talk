import React from 'react';
import PropTypes from 'prop-types';
import { IfSlotIsNotEmpty } from 'plugin-api/beta/client/components';
import { Slot } from 'plugin-api/beta/client/components';
import { t } from 'plugin-api/beta/client/services';
import styles from './Settings.css';
import { BareButton } from 'plugin-api/beta/client/components/ui';
import EmailVerificationBanner from '../containers/EmailVerificationBanner';
import cn from 'classnames';

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
      needEmailVerification,
      email,
    } = this.props;

    return (
      <IfSlotIsNotEmpty slot="notificationSettings" queryData={{ root }}>
        <div className={styles.root}>
          <h3>{t('talk-plugin-notifications.settings_title')}</h3>
          {needEmailVerification && <EmailVerificationBanner email={email} />}
          <h4
            className={cn(styles.subtitle, {
              [styles.disabled]: needEmailVerification,
            })}
          >
            {t('talk-plugin-notifications.settings_subtitle')}
          </h4>
          <div className={styles.innerSettings}>
            <Slot
              className={styles.notifcationSettingsSlot}
              fill="notificationSettings"
              queryData={{ root }}
              childFactory={this.childFactory}
              setTurnOffInputFragment={setTurnOffInputFragment}
              updateNotificationSettings={updateNotificationSettings}
              disabled={needEmailVerification}
            />
            <BareButton
              className={styles.turnOffButton}
              onClick={turnOffAll}
              disabled={turnOffButtonDisabled}
            >
              {t('talk-plugin-notifications.turn_off_all')}
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
  needEmailVerification: PropTypes.bool.isRequired,
  email: PropTypes.string,
};

export default Settings;
