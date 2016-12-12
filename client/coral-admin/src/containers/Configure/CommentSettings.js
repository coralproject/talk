import React, {Component, PropTypes} from 'react';
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

class CommentSettings extends Component {

  state = {
    charCountError: false
  }

  static propTypes = {
    updateSettings: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired
  }

  updateCharCountEnable = (updateSettings, charCountChecked) => () => {
    const charCountEnable = !charCountChecked;
    updateSettings({charCountEnable});
  };

  updateCharCount = (updateSettings) => (event) => {
    const charCount = event.target.value;
    if (charCount.match(/[^0-9]/)) {
      this.setState({charCountError: true});
    } else {
      this.setState({charCountError: false});
    }
    updateSettings({charCount: charCount});
  };

  updateModeration = (updateSettings, mod) => () => {
    const moderation = mod === 'pre' ? 'post' : 'pre';
    updateSettings({moderation});
  };

  updateInfoBoxEnable = (updateSettings, infoBox) => () => {
    const infoBoxEnable = !infoBox;
    updateSettings({infoBoxEnable});
  };

  updateInfoBoxContent = (updateSettings) => (event) => {
    const infoBoxContent =  event.target.value;
    updateSettings({infoBoxContent});
  };

  updateClosedMessage = (updateSettings) => (event) => {
    const closedMessage = event.target.value;
    updateSettings({closedMessage});
  };

  render() {

    const {updateSettings, settings} = this.props;

    return <List>
      <ListItem className={`${styles.configSetting} ${settings.moderation === 'pre' ? styles.enabledSetting : styles.disabledSetting}`}>
        <ListItemAction>
          <Checkbox
            onClick={this.updateModeration(updateSettings, settings.moderation)}
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
            onClick={this.updateCharCountEnable(updateSettings, settings.charCountEnable)}
            checked={settings.charCountEnable} />
        </ListItemAction>
        <ListItemContent>
          <div className={styles.settingsHeader}>{lang.t('configure.comment-count-header')}</div>
          <p className={settings.charCountEnable ? '' : styles.disabledSettingText}>
            <span>{lang.t('configure.comment-count-text-pre')}</span>
            <input type='text'
              className={`${styles.charCountTexfield} ${settings.charCountEnable && styles.charCountTexfieldEnabled}`}
              htmlFor='charCount'
              onChange={this.updateCharCount(updateSettings)}
              value={settings.charCount}/>
            <span>{lang.t('configure.comment-count-text-post')}</span>
              {
                this.state.charCountError &&
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
            onClick={this.updateInfoBoxEnable(updateSettings, settings.infoBoxEnable)}
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
            onChange={this.updateInfoBoxContent(updateSettings)}
            value={settings.infoBoxContent}
            label={lang.t('configure.include-text')}
            rows={3}/>
        </ListItemContent>
      </ListItem>
      <ListItem className={styles.configSettingInfoBox}>
        <ListItemContent>
          {lang.t('configure.closed-comments-desc')}
          <Textfield
            onChange={this.updateClosedMessage(updateSettings)}
            value={settings.closedMessage}
            label={lang.t('configure.closed-comments-label')}
            rows={3}/>
        </ListItemContent>
      </ListItem>
    </List>;
  }
}

export default CommentSettings;

const lang = new I18n(translations);
