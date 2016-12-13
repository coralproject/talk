import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import styles from './Configure.css';
import {
  List,
  ListItem,
  ListItemContent,
  ListItemAction,
  Textfield,
  Checkbox,
  Icon
} from 'react-mdl';

const updateCharCountEnable = (updateSettings, charCountChecked) => () => {
  const charCountEnable = !charCountChecked;
  updateSettings({charCountEnable});
};

const updateCharCount = (updateSettings, settingsError) => (event) => {
  const charCount = event.target.value;
  if (charCount.match(/[^0-9]/)) {
    settingsError('charCount', true);
  } else {
    settingsError('charCount', false);
  }
  updateSettings({charCount: charCount});
};

const updateModeration = (updateSettings, mod) => () => {
  const moderation = mod === 'pre' ? 'post' : 'pre';
  updateSettings({moderation});
};

const updateInfoBoxEnable = (updateSettings, infoBox) => () => {
  const infoBoxEnable = !infoBox;
  updateSettings({infoBoxEnable});
};

const updateInfoBoxContent = (updateSettings) => (event) => {
  const infoBoxContent =  event.target.value;
  updateSettings({infoBoxContent});
};

const updateClosedMessage = (updateSettings) => (event) => {
  const closedMessage = event.target.value;
  updateSettings({closedMessage});
};

const CommentSettings = ({updateSettings, settingsError, settings, errors}) => <List>
    <ListItem className={`${styles.configSetting} ${settings.moderation === 'pre' ? styles.enabledSetting : styles.disabledSetting}`}>
      <ListItemAction>
        <Checkbox
          onClick={updateModeration(updateSettings, settings.moderation)}
          checked={settings.moderation === 'pre'} />
      </ListItemAction>
      <ListItemContent>
      <div className={styles.settingsHeader}>{lang.t('configure.enable-pre-moderation')}</div>
      <p className={settings.moderation === 'pre' ? '' : styles.disabledSettingText}>
        {lang.t('configure.enable-pre-moderation-text')}
      </p>
    </ListItemContent>
    </ListItem>
    <ListItem className={`${styles.configSetting} ${settings.charCountEnable ? styles.enabledSetting : styles.disabledSetting}`}>
      <ListItemAction>
        <Checkbox
          onClick={updateCharCountEnable(updateSettings, settings.charCountEnable)}
          checked={settings.charCountEnable} />
      </ListItemAction>
      <ListItemContent>
        <div className={styles.settingsHeader}>{lang.t('configure.comment-count-header')}</div>
        <p className={settings.charCountEnable ? '' : styles.disabledSettingText}>
          <span>{lang.t('configure.comment-count-text-pre')}</span>
          <input type='text'
            className={`${styles.charCountTexfield} ${settings.charCountEnable && styles.charCountTexfieldEnabled}`}
            htmlFor='charCount'
            onChange={updateCharCount(updateSettings, settingsError)}
            value={settings.charCount}/>
          <span>{lang.t('configure.comment-count-text-post')}</span>
            {
              errors.charCount &&
              <span className={styles.settingsError}>
                <br/>
                <Icon name="error_outline"/>
                {lang.t('configure.comment-count-error')}
              </span>
            }
        </p>
      </ListItemContent>
    </ListItem>
    <ListItem threeLine className={`${styles.configSettingInfoBox} ${settings.infoBoxEnable ? styles.enabledSetting : styles.disabledSetting}`}>
      <ListItemAction>
        <Checkbox
          onClick={updateInfoBoxEnable(updateSettings, settings.infoBoxEnable)}
          checked={settings.infoBoxEnable} />
      </ListItemAction>
      <ListItemContent>
        {lang.t('configure.include-comment-stream')}
        <p>
          {lang.t('configure.include-comment-stream-desc')}
        </p>
      </ListItemContent>
    </ListItem>
    <ListItem className={`${styles.configSettingInfoBox} ${settings.infoBoxEnable ? null : styles.hidden}`} >
      <ListItemContent>
        <Textfield
          onChange={updateInfoBoxContent(updateSettings)}
          value={settings.infoBoxContent}
          label={lang.t('configure.include-text')}
          rows={3}/>
      </ListItemContent>
    </ListItem>
    <ListItem className={styles.configSettingInfoBox}>
      <ListItemContent>
        {lang.t('configure.closed-comments-desc')}
        <Textfield
          onChange={updateClosedMessage(updateSettings)}
          value={settings.closedMessage}
          label={lang.t('configure.closed-comments-label')}
          rows={3}/>
      </ListItemContent>
    </ListItem>
  </List>;

export default CommentSettings;

const lang = new I18n(translations);
