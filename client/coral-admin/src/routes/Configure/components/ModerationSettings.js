import React from 'react';
import PropTypes from 'prop-types';
import styles from './ModerationSettings.css';
import {Card} from 'coral-ui';
import {Checkbox} from 'react-mdl';
import Wordlist from './Wordlist';
import Slot from 'coral-framework/components/Slot';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';

class ModerationSettings extends React.Component {

  updateModeration = () => {
    const updater = {moderation: {$set: this.props.settings.moderation === 'PRE' ? 'POST' : 'PRE'}};
    this.props.updatePending({updater});
  };

  updateEmailConfirmation = () => {
    const updater = {requireEmailConfirmation: {$set: !this.props.settings.requireEmailConfirmation}};
    this.props.updatePending({updater});
  };

  updatePremodLinksEnable = () => {
    const updater = {premodLinksEnable: {$set: !this.props.settings.premodLinksEnable}};
    this.props.updatePending({updater});
  };

  updateWordlist = (listName, list) => {
    this.props.updatePending({updater: {
      wordlist: {$apply: (wordlist) => {
        const changeSet = {[listName]: list};
        if (!wordlist) {
          return changeSet;
        }
        return {
          ...wordlist,
          ...changeSet,
        };
      }},
    }});
  };

  render() {
    const {settings, data, root} = this.props;

    // just putting this here for shorthand below
    const on = styles.enabledSetting;
    const off = styles.disabledSetting;

    return (
      <div>
        <h3 className={styles.title}>{t('configure.moderation_settings')}</h3>
        <Card className={cn(styles.card, settings.requireEmailConfirmation ? on : off)}>
          <div className={styles.action}>
            <Checkbox
              onChange={this.updateEmailConfirmation}
              checked={settings.requireEmailConfirmation} />
          </div>
          <div className={styles.content}>
            <div className={styles.header}>{t('configure.require_email_verification')}</div>
            <p className={settings.requireEmailConfirmation ? '' : styles.disabledSettingText}>
              {t('configure.require_email_verification_text')}
            </p>
          </div>
        </Card>
        <Card className={cn(styles.card, settings.moderation === 'PRE' ? on : off)}>
          <div className={styles.action}>
            <Checkbox
              onChange={this.updateModeration}
              checked={settings.moderation === 'PRE'} />
          </div>
          <div className={styles.content}>
            <div className={styles.header}>{t('configure.enable_pre_moderation')}</div>
            <p className={settings.moderation === 'PRE' ? '' : styles.disabledSettingText}>
              {t('configure.enable_pre_moderation_text')}
            </p>
          </div>
        </Card>
        <Card className={`${styles.card} ${settings.premodLinksEnable ? on : off}`}>
          <div className={styles.action}>
            <Checkbox
              onChange={this.updatePremodLinksEnable}
              checked={settings.premodLinksEnable} />
          </div>
          <div className={styles.content}>
            <div className={styles.header}>{t('configure.enable_premod_links')}</div>
            <p className={settings.premodLinksEnable ? '' : styles.disabledSettingText}>
              {t('configure.enable_premod_links_text')}
            </p>
          </div>
        </Card>
        <Wordlist
          bannedWords={settings.wordlist.banned}
          suspectWords={settings.wordlist.suspect}
          onChangeWordlist={this.updateWordlist} />
        <Slot
          fill="adminModerationSettings"
          data={data}
          queryData={{root, settings}}
        />
      </div>
    );
  }
}

ModerationSettings.propTypes = {
  updatePending: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
};

export default ModerationSettings;
