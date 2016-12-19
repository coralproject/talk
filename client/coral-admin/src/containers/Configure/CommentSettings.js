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
  Checkbox,
  Icon
} from 'react-mdl';

const TIMESTAMPS = {
  weeks: 60 * 60 * 24 * 7,
  days: 60 * 60 * 24,
  hours: 60 * 60
};

const updateCharCountEnable = (updateSettings, charCountChecked) => () => {
  const charCountEnable = !charCountChecked;
  updateSettings({charCountEnable});
};

const updateCharCount = (updateSettings, settingsError) => (event) => {
  const charCount = event.target.value;
  if (charCount.match(/[^0-9]/) || charCount.length === 0) {
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

// If we are changing the measure we need to recalculate using the old amount
// Same thing if we are just changing the amount
const updateClosedTimeout = (updateSettings, ts, isMeasure) => (event) => {
  if (isMeasure) {
    const amount = getTimeoutAmount(ts);
    const closedTimeout = amount * TIMESTAMPS[event];
    updateSettings({closedTimeout});
  } else {
    const val = event.target.value;
    const measure = getTimeoutMeasure(ts);
    const closedTimeout = val * TIMESTAMPS[measure];
    updateSettings({closedTimeout});
  }
};

const CommentSettings = ({fetchingSettings, title, updateSettings, settingsError, settings, errors}) => {
  if (fetchingSettings) {
    /* maybe a spinner here at some point */
    return <p>Loading settings...</p>;
  }

  return (
    <div>
      <h3>{title}</h3>
      <List>
        <ListItem className={`${styles.configSetting} ${settings.moderation === 'pre' ? styles.enabledSetting : styles.disabledSetting}`}>
          <ListItemAction>
            <Checkbox
              onChange={updateModeration(updateSettings, settings.moderation)}
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
              onChange={updateCharCountEnable(updateSettings, settings.charCountEnable)}
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
              onChange={updateInfoBoxEnable(updateSettings, settings.infoBoxEnable)}
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
            {lang.t('configure.close-after')}
            <br />
            <Textfield
              type='number'
              pattern='[0-9]+'
              style={{width: 50}}
              onChange={updateClosedTimeout(updateSettings, settings.closedTimeout)}
              value={getTimeoutAmount(settings.closedTimeout)}
              label={lang.t('configure.closed-comments-label')} />
            <div className={styles.configTimeoutSelect}>
              <SelectField
                label="comments closed time window"
                value={getTimeoutMeasure(settings.closedTimeout)}
                onChange={updateClosedTimeout(updateSettings, settings.closedTimeout, true)}>
                <Option value={'hours'}>{lang.t('configure.hours')}</Option>
                <Option value={'days'}>{lang.t('configure.days')}</Option>
                <Option value={'weeks'}>{lang.t('configure.weeks')}</Option>
              </SelectField>
            </div>
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
      </List>
    </div>
  );
};

export default CommentSettings;

// To see if we are talking about weeks, days or hours
// We talk the remainder of the division and see if it's 0
const getTimeoutMeasure = ts => {
  if (ts % TIMESTAMPS['weeks'] === 0) {
    return 'weeks';
  } else if (ts % TIMESTAMPS['days'] === 0) {
    return 'days';
  } else if (ts % TIMESTAMPS['hours'] === 0) {
    return 'hours';
  }
};

// Dividing the amount by it's measure (hours, days, weeks) we
// obtain the amount of time
const getTimeoutAmount = ts => ts / TIMESTAMPS[getTimeoutMeasure(ts)];

const lang = new I18n(translations);
