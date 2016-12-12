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
  Checkbox
} from 'react-mdl';

const updateCharCountEnable = (updateSettings, charCountChecked) => () => {
  const charCountEnable = !charCountChecked;
  updateSettings({charCountEnable});
};

const updateCharCount = (updateSettings) => (event) => {
  const charCount = event.target.value;
  if (charCount.match(/[^0-9]/)) {
    //Show error
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

const CommentSettings = (props) => <List>
  <ListItem className={styles.configSetting}>
    <ListItemAction>
      <Checkbox
        onClick={updateModeration(props.updateSettings, props.settings.moderation)}
        checked={props.settings.moderation === 'pre'} />
    </ListItemAction>
    {lang.t('configure.enable-pre-moderation')}
  </ListItem>
  <ListItem className={styles.configSetting}>
    <ListItemAction>
      <Checkbox
        onClick={updateCharCountEnable(props.updateSettings, props.settings.charCountEnable)}
        checked={props.settings.charCountEnable} />
    </ListItemAction>
    <ListItemContent>
      Limit Content Length
      <p className={props.settings.charCountEnable ? '' : styles.disabledSettingText}>
        <span>Comments will be limited to </span>
        <input type='text'
          className={styles.charCountTexfield}
          htmlFor='charCount'
          onChange={updateCharCount(props.updateSettings)}
          value={props.settings.charCount}/>
        <span> characters.</span>
      </p>
    </ListItemContent>
  </ListItem>
  <ListItem threeLine className={styles.configSettingInfoBox}>
    <ListItemAction>
      <Checkbox
        onClick={updateInfoBoxEnable(props.updateSettings, props.settings.infoBoxEnable)}
        checked={props.settings.infoBoxEnable} />
    </ListItemAction>
    <ListItemContent>
      {lang.t('configure.include-comment-stream')}
      <p>
        {lang.t('configure.include-comment-stream-desc')}
      </p>
    </ListItemContent>
  </ListItem>
  <ListItem className={`${styles.configSettingInfoBox} ${props.settings.infoBoxEnable ? null : styles.hidden}`} >
    <ListItemContent>
      <Textfield
        onChange={updateInfoBoxContent(props.updateSettings)}
        value={props.settings.infoBoxContent}
        label={lang.t('configure.include-text')}
        rows={3}/>
    </ListItemContent>
  </ListItem>
  <ListItem className={styles.configSettingInfoBox}>
    <ListItemContent>
      {lang.t('configure.closed-comments-desc')}
      <Textfield
        onChange={updateClosedMessage(props.updateSettings)}
        value={props.settings.closedMessage}
        label={lang.t('configure.closed-comments-label')}
        rows={3}/>
    </ListItemContent>
  </ListItem>
</List>;

export default CommentSettings;

const lang = new I18n(translations);
