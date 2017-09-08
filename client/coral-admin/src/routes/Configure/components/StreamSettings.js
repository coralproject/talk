import React from 'react';
import {SelectField, Option} from 'react-mdl-selectfield';
import t from 'coral-framework/services/i18n';
import styles from './Configure.css';
import {Checkbox, Textfield} from 'react-mdl';
import {Card, Icon, TextArea} from 'coral-ui';
import MarkdownEditor from 'coral-framework/components/MarkdownEditor';

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

const updateInfoBoxEnable = (updateSettings, infoBox) => () => {
  const infoBoxEnable = !infoBox;
  updateSettings({infoBoxEnable});
};

const updateInfoBoxContent = (updateSettings) => (value) => {
  const infoBoxContent = value;
  updateSettings({infoBoxContent});
};

const updateAutoClose = (updateSettings, autoCloseStream) => () => {
  updateSettings({autoCloseStream});
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

const updateEditCommentWindowLength = (updateSettings) => (e) => {
  const value = e.target.value;
  const valueAsNumber = parseFloat(value);
  const milliseconds = (!isNaN(valueAsNumber)) && (valueAsNumber * 1000);
  updateSettings({editCommentWindowLength: milliseconds || value});
};

const StreamSettings = ({updateSettings, settingsError, settings, errors}) => {

  // just putting this here for shorthand below
  const on = styles.enabledSetting;
  const off = styles.disabledSetting;

  return (
    <div className={styles.Configure}>
      <Card className={`${styles.configSetting} ${settings.charCountEnable ? on : off}`}>
        <div className={styles.action}>
          <Checkbox
            onChange={updateCharCountEnable(updateSettings, settings.charCountEnable)}
            checked={settings.charCountEnable} />
        </div>
        <div className={styles.content}>
          <div className={styles.settingsHeader}>{t('configure.comment_count_header')}</div>
          <p className={settings.charCountEnable ? '' : styles.disabledSettingText}>
            <span>{t('configure.comment_count_text_pre')}</span>
            <input type='text'
              className={`${styles.inlineTextfield} ${styles.charCountTexfield} ${settings.charCountEnable && styles.charCountTexfieldEnabled}`}
              htmlFor='charCount'
              onChange={updateCharCount(updateSettings, settingsError)}
              value={settings.charCount}
              disabled={settings.charCountEnable ? '' : 'disabled'}
            />
            <span>{t('configure.comment_count_text_post')}</span>
            {
              errors.charCount &&
                <span className={styles.settingsError}>
                  <br/>
                  <Icon name="error_outline"/>
                  {t('configure.comment_count_error')}
                </span>
            }
          </p>
        </div>
      </Card>
      <Card className={`${styles.configSetting} ${styles.configSettingInfoBox} ${settings.infoBoxEnable ? on : off}`}>
        <div className={styles.action}>
          <Checkbox
            onChange={updateInfoBoxEnable(updateSettings, settings.infoBoxEnable)}
            checked={settings.infoBoxEnable} />
        </div>
        <div className={styles.content}>
          <div className={styles.settingsHeader}>
            {t('configure.include_comment_stream')}
          </div>
          <p className={settings.infoBoxEnable ? '' : styles.disabledSettingText}>
            {t('configure.include_comment_stream_desc')}
          </p>
          <div className={`${styles.configSettingInfoBox} ${settings.infoBoxEnable ? null : styles.hidden}`} >
            <MarkdownEditor
              className={styles.descriptionBox}
              onChange={updateInfoBoxContent(updateSettings)}
              value={settings.infoBoxContent}
            />
          </div>
        </div>
      </Card>
      <Card className={`${styles.configSetting} ${styles.configSettingInfoBox}`}>
        <div className={styles.wrapper}>
          <div className={styles.settingsHeader}>{t('configure.closed_stream_settings')}</div>
          <p>{t('configure.closed_comments_desc')}</p>
          <div>
            <TextArea className={styles.descriptionBox}
              onChange={updateClosedMessage(updateSettings)}
              value={settings.closedMessage}
            />
          </div>
        </div>
      </Card>
      {/* Edit Comment Timeframe */}
      <Card className={styles.configSetting}>
        <div className={styles.settingsHeader}>{t('configure.edit_comment_timeframe_heading')}</div>
        <p>
          {t('configure.edit_comment_timeframe_text_pre')}
          &nbsp;
          <input
            className={`${styles.inlineTextfield} ${styles.editCommentTimeframeTextfield}`}
            type="number"
            min="0"
            onChange={updateEditCommentWindowLength(updateSettings)}
            placeholder="30"
            defaultValue={(settings.editCommentWindowLength / 1000) /* saved as ms, rendered as seconds */}
            pattern='[0-9]+([\.][0-9]*)?'
          />
          &nbsp;
          {t('configure.edit_comment_timeframe_text_post')}
        </p>
      </Card>
      <Card className={`${styles.configSetting} ${styles.configSettingInfoBox}`}>
        <div className={styles.action}>
          <Checkbox
            onChange={updateAutoClose(updateSettings, !settings.autoCloseStream)}
            checked={settings.autoCloseStream} />
        </div>
        <div className={styles.content}>
          <div className={styles.settingsHeader}>{t('configure.close_after')}</div>
          <br />
          <Textfield
            type='number'
            pattern='[0-9]+'
            style={{width: 50}}
            onChange={updateClosedTimeout(updateSettings, settings.closedTimeout)}
            value={getTimeoutAmount(settings.closedTimeout)}
            label={t('configure.closed_comments_label')} />
          <div className={styles.configTimeoutSelect}>
            <SelectField
              label="comments closed time window"
              value={getTimeoutMeasure(settings.closedTimeout)}
              onChange={updateClosedTimeout(updateSettings, settings.closedTimeout, true)}>
              <Option value={'hours'}>{t('configure.hours')}</Option>
              <Option value={'days'}>{t('configure.days')}</Option>
              <Option value={'weeks'}>{t('configure.weeks')}</Option>
            </SelectField>
          </div>
        </div>
      </Card>
      {/* the above card should be the last one if at all possible because of z-index issues with the selects */}
    </div>
  );
};

export default StreamSettings;

// To see if we are talking about weeks, days or hours
// We talk the remainder of the division and see if it's 0
const getTimeoutMeasure = (ts) => {
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
const getTimeoutAmount = (ts) => ts / TIMESTAMPS[getTimeoutMeasure(ts)];
