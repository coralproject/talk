import React from 'react';
import PropTypes from 'prop-types';
import { IfSlotIsNotEmpty } from 'plugin-api/beta/client/components';
import { Slot } from 'plugin-api/beta/client/components';
import { t } from 'plugin-api/beta/client/services';
import styles from './Settings.css';
import {
  BareButton,
  Dropdown,
  Option,
} from 'plugin-api/beta/client/components/ui';
import EmailVerificationBanner from '../containers/EmailVerificationBanner';
import cn from 'classnames';

class Settings extends React.Component {
  childFactory = el => {
    const key = el.key;
    const props = {
      indicateOn: () => this.props.indicateOn(key),
      indicateOff: () => this.props.indicateOff(key),
    };
    return React.cloneElement(el, props);
  };

  render() {
    const {
      root,
      setTurnOffInputFragment,
      updateNotificationSettings,
      turnOffAll,
      needEmailVerification,
      email,
      digestFrequencyValues,
      digestFrequency,
      disableDigest,
      disableTurnoffButton,
      onChangeDigestFrequency,
    } = this.props;

    const slotPassthrough = {
      root,
      setTurnOffInputFragment,
      updateNotificationSettings,
      disabled: needEmailVerification,
    };

    return (
      <IfSlotIsNotEmpty
        slot="notificationSettings"
        passthrough={slotPassthrough}
      >
        <div className={styles.root}>
          <h3>{t('talk-plugin-notifications.settings_title')}</h3>
          <div className={styles.bannerContainer}>
            {needEmailVerification && <EmailVerificationBanner email={email} />}
          </div>
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
              childFactory={this.childFactory}
              passthrough={slotPassthrough}
            />
          </div>
          {digestFrequencyValues.length > 1 && (
            <div className={styles.digest}>
              <h4
                className={cn(styles.titleDigest, {
                  [styles.disabled]: disableDigest,
                })}
              >
                {t('talk-plugin-notifications.digest_option')}
              </h4>
              <Dropdown
                className={styles.digestDropDown}
                value={digestFrequency}
                onChange={onChangeDigestFrequency}
                disabled={disableDigest}
              >
                {digestFrequencyValues.map(v => (
                  <Option
                    value={v}
                    key={v}
                    label={t(`talk-plugin-notifications.digest_enum.${v}`)}
                  />
                ))}
              </Dropdown>
            </div>
          )}
          <BareButton
            className={styles.turnOffButton}
            onClick={turnOffAll}
            disabled={disableTurnoffButton}
          >
            {t('talk-plugin-notifications.turn_off_all')}
          </BareButton>
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
  disableTurnoffButton: PropTypes.bool.isRequired,
  disableDigest: PropTypes.bool.isRequired,
  needEmailVerification: PropTypes.bool.isRequired,
  email: PropTypes.string,
  digestFrequencyValues: PropTypes.array.isRequired,
  digestFrequency: PropTypes.string.isRequired,
  onChangeDigestFrequency: PropTypes.func.isRequired,
};

export default Settings;
