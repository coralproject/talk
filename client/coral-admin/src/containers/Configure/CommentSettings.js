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

const updateModeration = (props) => () => {
  const moderation = props.settings.moderation === 'pre' ? 'post' : 'pre';
  props.updateSettings({moderation});
};

const updateInfoBoxEnable = (props) => () => {
  const infoBoxEnable = !props.settings.infoBoxEnable;
  props.updateSettings({infoBoxEnable});
};

const updateInfoBoxContent = (props) => (event) => {
  const infoBoxContent =  event.target.value;
  props.updateSettings({infoBoxContent});
};

const updateClosedMessage = (props) => (event) => {
  const closedMessage = event.target.value;
  props.updateSettings({closedMessage});
};

const CommentSettings = (props) => <List>
  <ListItem className={styles.configSetting}>
    <ListItemAction>
      <Checkbox
        onClick={updateModeration}
        checked={props.settings.moderation === 'pre'} />
    </ListItemAction>
    {lang.t('configure.enable-pre-moderation')}
  </ListItem>
  <ListItem threeLine className={styles.configSettingInfoBox}>
    <ListItemAction>
      <Checkbox
        onClick={updateInfoBoxEnable}
        checked={props.settings.infoBoxEnable} />
    </ListItemAction>
    <ListItemContent>
      {lang.t('configure.include-comment-stream')}
      <p>
        {lang.t('configure.include-comment-stream-desc')}
      </p>
    </ListItemContent>
  </ListItem>
  <ListItem className={styles.configSettingInfoBox}>
    <ListItemContent>
      {lang.t('configure.closed-comments-desc')}
      <Textfield
        onChange={updateClosedMessage}
        value={props.settings.closedMessage}
        label={lang.t('configure.closed-comments-label')}
        rows={3}/>
    </ListItemContent>
  </ListItem>
  <ListItem className={`${styles.configSettingInfoBox} ${this.props.settings.infoBoxEnable ? null : styles.hidden}`} >
    <ListItemContent>
      <Textfield
        onChange={updateInfoBoxContent}
        value={props.settings.infoBoxContent}
        label={lang.t('configure.include-text')}
        rows={3}/>
    </ListItemContent>
  </ListItem>
</List>;

export default CommentSettings;

const lang = new I18n(translations);
