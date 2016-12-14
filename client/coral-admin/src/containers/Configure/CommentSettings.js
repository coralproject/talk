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

const TIMESTAMPS = {
  weeks: 60 * 60 * 24 * 7,
  days: 60 * 60 *24,
  hours: 60 * 60
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
    updateSettings({ closedTimeout });
  } else {
    const val = event.target.value;
    const measure = getTimeoutMeasure(ts);
    const closedTimeout = val * TIMESTAMPS[measure];
    updateSettings({ closedTimeout });
  }
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
      {lang.t('configure.close-after')}
      <br />
      <Textfield
        type='number'
        pattern='[0-9]+'
        style={{width: 50}}
        onChange={updateClosedTimeout(props.updateSettings, props.settings.closedTimeout)}
        value={getTimeoutAmount(props.settings.closedTimeout)}
        label={lang.t('configure.closed-comments-label')} />
      <div className={styles.configTimeoutSelect}>
        <SelectField value={getTimeoutMeasure(props.settings.closedTimeout)}
          onChange={updateClosedTimeout(props.updateSettings, props.settings.closedTimeout, true)}>
          <Option value={'hours'}>{lang.t('configure.hours')}</Option>
          <Option value={'days'}>{lang.t('configure.days')}</Option>
          <Option value={'weeks'}>{lang.t('configure.weeks')}</Option>
        </SelectField>
      </div>
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
}

// Dividing the amount by it's measure (hours, days, weeks) we
// obtain the amount of time
const getTimeoutAmount = ts => ts / TIMESTAMPS[getTimeoutMeasure(ts)];

const lang = new I18n(translations);
