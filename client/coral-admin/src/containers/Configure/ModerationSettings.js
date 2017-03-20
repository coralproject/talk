import React, { PropTypes } from 'react';
import styles from './Configure.css';
import { Card } from 'coral-ui';
import { Checkbox } from 'react-mdl';
import Wordlist from './Wordlist';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
const lang = new I18n(translations);

const updateModeration = (updateSettings, mod) => () => {
  const moderation = mod === 'PRE' ? 'POST' : 'PRE';
  updateSettings({ moderation });
};

const updateEmailConfirmation = (updateSettings, verify) => () => {
  updateSettings({ requireEmailConfirmation: !verify });
};

const updatePremodLinksEnable = (updateSettings, premodLinks) => () => {
  const premodLinksEnable = !premodLinks;
  updateSettings({ premodLinksEnable });
};

const ModerationSettings = ({ settings, updateSettings, onChangeWordlist }) => {

  // just putting this here for shorthand below
  const on = styles.enabledSetting;
  const off = styles.disabledSetting;

  return (
    <div className={styles.Configure}>
      <Card className={`${styles.configSetting} ${settings.requireEmailConfirmation ? on : off}`}>
        <div className={styles.action}>
          <Checkbox
            onChange={updateEmailConfirmation(updateSettings, settings.requireEmailConfirmation)}
            checked={settings.requireEmailConfirmation} />
        </div>
        <div className={styles.content}>
          <div className={styles.settingsHeader}>{lang.t('configure.require-email-verification')}</div>
          <p className={settings.requireEmailConfirmation ? '' : styles.disabledSettingText}>
            {lang.t('configure.require-email-verification-text')}
          </p>
        </div>
      </Card>
      <Card className={`${styles.configSetting} ${settings.moderation === 'PRE' ? on : off}`}>
        <div className={styles.action}>
          <Checkbox
            onChange={updateModeration(updateSettings, settings.moderation)}
            checked={settings.moderation === 'PRE'} />
        </div>
        <div className={styles.content}>
          <div className={styles.settingsHeader}>{lang.t('configure.enable-pre-moderation')}</div>
          <p className={settings.moderation === 'PRE' ? '' : styles.disabledSettingText}>
            {lang.t('configure.enable-pre-moderation-text')}
          </p>
        </div>
      </Card>
      <Card className={`${styles.configSetting} ${settings.premodLinksEnable ? on : off}`}>
        <div className={styles.action}>
          <Checkbox
            onChange={updatePremodLinksEnable(updateSettings, settings.premodLinksEnable)}
            checked={settings.premodLinksEnable} />
        </div>
        <div className={styles.content}>
          <div className={styles.settingsHeader}>{lang.t('configure.enable-premod-links')}</div>
          <p>
            {lang.t('configure.enable-premod-links-text')}
          </p>
        </div>
      </Card>
      <Wordlist
        bannedWords={settings.wordlist.banned}
        suspectWords={settings.wordlist.suspect}
        onChangeWordlist={onChangeWordlist} />
    </div>
  );
};

ModerationSettings.propTypes = {
  onChangeWordlist: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    moderation: PropTypes.string.isRequired,
    wordlist: PropTypes.shape({
      banned: PropTypes.array.isRequired,
      suspect: PropTypes.array.isRequired
    })
  }).isRequired,
  updateSettings: PropTypes.func.isRequired
};

export default ModerationSettings;
