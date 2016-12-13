import React from 'react';
import {SelectField, Option} from 'react-mdl-selectfield';
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

const updateClosedTimeout = (updateSettings, isMeasure) => (event) => {
  if (isMeasure) {
    
  }

  const closedTimeout = event.target.value;

  updateSettings({ closedTimeout });
});

const CommentSettings = (props) => <List>
  <ListItem className={styles.configSetting}>
    <ListItemAction>
      <Checkbox
        onClick={updateModeration(props.updateSettings, props.settings.moderation)}
        checked={props.settings.moderation === 'pre'} />
    </ListItemAction>
    {lang.t('configure.enable-pre-moderation')}
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
  <ListItem className={styles.configSettingInfoBox}>
    <ListItemContent>
      <p>{lang.t('configure.close-after')}</p>
      <Textfield
        type='number'
        pattern='[0-9]+'
        style={{width: 200}}
        onChange={updateClosedMessage(props.updateSettings)}
        value={getTimeoutAmount(props.settings.closedTimeout)}
        label={lang.t('configure.closed-comments-label')} />
      <SelectField value={getTimeoutMeasure(props.settings.closedTimeout)}
        onChange={updateClosedTimeout(props.updateSettings, true)}>
        <Option value={'never'}>{lang.t('configure.never')}</Option>
        <Option value={'hours'}>{lang.t('configure.hours')}</Option>
        <Option value={'days'}>{lang.t('configure.days')}</Option>
        <Option value={'weeks'}>{lang.t('configure.weeks')}</Option>
      </SelectField>
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

const getTimeoutMeasure = ts => {
  if (isNaN(ts)) {
    return 'never';
  } else if (ts % (60 * 60 * 24 * 7) === 0) {
    return 'weeks';
  } else if (ts % (60 * 60 * 24) === 0) {
    return 'days';
  } else {
    return 'hours';
  }
}

const getTimeoutAmount = ts => {
  const measure = getTimeoutMeasure(ts);
  switch (measure) {
    case 'weeks':
      return ts / (60 * 60 * 24 * 7);
    case 'days':
      return ts / (60 * 60 * 24);
    case 'hours':
      return ts / (60 * 60);
    case 'never':
    default:
      return '';
  }
}

const lang = new I18n(translations);
