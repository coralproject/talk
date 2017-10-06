import React from 'react';
import {SelectField, Option} from 'react-mdl-selectfield';
import t from 'coral-framework/services/i18n';
import styles from './Configure.css';
import {Checkbox, Textfield} from 'react-mdl';
import {Card, Icon, TextArea} from 'coral-ui';
import PropTypes from 'prop-types';
import MarkdownEditor from 'coral-framework/components/MarkdownEditor';

const TIMESTAMPS = {
  weeks: 60 * 60 * 24 * 7,
  days: 60 * 60 * 24,
  hours: 60 * 60
};

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

class StreamSettings extends React.Component {

  updateCharCountEnable = () => {
    const updater = {charCountEnable: {$set: !this.props.settings.charCountEnable}};
    this.props.updatePending({updater});
  };

  updateCharCount = (event) => {
    let error = null;
    const charCount = event.target.value;
    if (charCount.match(/[^0-9]/) || charCount.length === 0) {
      error = true;
    }

    const updater = {charCount: {$set: charCount}};
    const errorUpdater = {charCount: {$set: error}};

    this.props.updatePending({updater, errorUpdater});
  };

  updateInfoBoxEnable = () => {
    const updater = {infoBoxEnable: {$set: !this.props.settings.infoBoxEnable}};
    this.props.updatePending({updater});
  };

  updateInfoBoxContent = (value) => {
    const updater = {infoBoxContent: {$set: value}};
    this.props.updatePending({updater});
  };

  updateClosedMessage = (event) => {
    const updater = {closedMessage: {$set: event.target.value}};
    this.props.updatePending({updater});
  };

  updateEditCommentWindowLength = (e) => {
    const value = e.target.value;
    const valueAsNumber = parseFloat(value);
    const milliseconds = (!isNaN(valueAsNumber)) && (valueAsNumber * 1000);

    const updater = {editCommentWindowLength: {$set: milliseconds || value}};
    this.props.updatePending({updater});
  };

  updateAutoClose = () => {
    const updater = {autoCloseStream: {$set: !this.props.settings.autoCloseStream}};
    this.props.updatePending({updater});
  };

  updateClosedTimeout = (event) => {
    const val = event.target.value;
    const measure = getTimeoutMeasure(this.props.settings.closedTimeout);

    const updater = {closedTimeout: {$set: val * TIMESTAMPS[measure]}};
    this.props.updatePending({updater});
  };

  // If we are changing the measure we need to recalculate using the old amount
  // Same thing if we are just changing the amount
  updateClosedTimeoutMeasure = (event) => {
    const amount = getTimeoutAmount(this.props.settings.closedTimeout);

    const updater = {closedTimeout: {$set: amount * TIMESTAMPS[event]}};
    this.props.updatePending({updater});
  };

  render() {
    const {settings, errors} = this.props;

    // just putting this here for shorthand below
    const on = styles.enabledSetting;
    const off = styles.disabledSetting;

    return (
      <div className={styles.Configure}>
        <h3>{t('configure.stream_settings')}</h3>
        <Card className={`${styles.configSetting} ${settings.charCountEnable ? on : off}`}>
          <div className={styles.action}>
            <Checkbox
              onChange={this.updateCharCountEnable}
              checked={settings.charCountEnable} />
          </div>
          <div className={styles.content}>
            <div className={styles.settingsHeader}>{t('configure.comment_count_header')}</div>
            <p className={settings.charCountEnable ? '' : styles.disabledSettingText}>
              <span>{t('configure.comment_count_text_pre')}</span>
              <input type='text'
                className={`${styles.inlineTextfield} ${styles.charCountTexfield} ${settings.charCountEnable && styles.charCountTexfieldEnabled}`}
                htmlFor='charCount'
                onChange={this.updateCharCount}
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
              onChange={this.updateInfoBoxEnable}
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
                onChange={this.updateInfoBoxContent}
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
                onChange={this.updateClosedMessage}
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
              onChange={this.updateEditCommentWindowLength}
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
              onChange={this.updateAutoClose}
              checked={settings.autoCloseStream} />
          </div>
          <div className={styles.content}>
            <div className={styles.settingsHeader}>{t('configure.close_after')}</div>
            <br />
            <Textfield
              type='number'
              pattern='[0-9]+'
              style={{width: 50}}
              onChange={this.updateClosedTimeout}
              value={getTimeoutAmount(settings.closedTimeout)}
              label={t('configure.closed_comments_label')} />
            <div className={styles.configTimeoutSelect}>
              <SelectField
                label="comments closed time window"
                value={getTimeoutMeasure(settings.closedTimeout)}
                onChange={this.updateClosedTimeoutMeasure}>
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
  }
}

StreamSettings.propTypes = {
  updatePending: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
};

export default StreamSettings;

