import React from 'react';
import {connect} from 'react-redux';
import {fetchSettings, updateSettings, saveSettingsToServer} from '../../actions/settings';
import {
  List,
  ListItem,
  ListItemContent,
  ListItemAction,
  Textfield,
  Checkbox,
  Button,
  Icon
} from 'react-mdl';
import styles from './Configure.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';

class Configure extends React.Component {
  constructor (props) {
    super(props);

    this.state = {activeSection: 'comments', copied: false};

    this.copyToClipBoard = this.copyToClipBoard.bind(this);

    // Update settings
    this.updateModeration = this.updateModeration.bind(this);
    // InfoBox has two settings. Enable or not and the content of it if it is enable.
    this.updateInfoBoxEnable = this.updateInfoBoxEnable.bind(this);
    this.updateInfoBoxContent = this.updateInfoBoxContent.bind(this);

    this.saveSettings = this.saveSettings.bind(this);
  }

  componentWillMount () {
    this.props.dispatch(fetchSettings());
  }

  updateModeration () {
    const moderation = this.props.settings.moderation === 'pre' ? 'post' : 'pre';
    this.props.dispatch(updateSettings({moderation}));
  }

  updateInfoBoxEnable () {
    const infoBoxEnable = !this.props.settings.infoBoxEnable;
    this.props.dispatch(updateSettings({infoBoxEnable}));
  }

  updateInfoBoxContent (event) {
    const infoBoxContent =  event.target.value;
    this.props.dispatch(updateSettings({infoBoxContent}));
  }

  saveSettings () {
    this.props.dispatch(saveSettingsToServer());
  }

  getCommentSettings () {
    return <List>
      <ListItem className={styles.configSetting}>
        <ListItemAction>
          <Checkbox
            onClick={this.updateModeration}
            checked={this.props.settings.moderation === 'pre'} />
        </ListItemAction>
        {lang.t('configure.enable-pre-moderation')}
      </ListItem>
      <ListItem threeLine className={styles.configSettingInfoBox}>
        <ListItemAction>
          <Checkbox
            onClick={this.updateInfoBoxEnable}
            checked={this.props.settings.infoBoxEnable} />
        </ListItemAction>
        <ListItemContent>
          {lang.t('configure.include-comment-stream')}
          <p>
            {lang.t('configure.include-comment-stream-desc')}
          </p>
        </ListItemContent>
      </ListItem>
      <ListItem className={`${styles.configSettingInfoBox} ${this.props.settings.infoBoxEnable ? null : styles.hidden}`} >
        <ListItemContent>
          <Textfield
            onChange={this.updateInfoBoxContent}
            value={this.props.settings.infoBoxContent}
            label={lang.t('configure.include-text')}
            rows={3}/>
        </ListItemContent>
      </ListItem>
    </List>;
  }

  copyToClipBoard () {
    const copyTextarea = document.querySelector(`.${  styles.embedInput}`);
    copyTextarea.select();

    try {
      document.execCommand('copy');
      this.setState({copied: true});
    } catch (err) {
      console.error('Unable to copy', err);
    }
  }

  getEmbed () {
    const embedText = `<div id='coralStreamEmbed'></div><script type='text/javascript' src='${window.location.protocol}//pym.nprapps.org/pym.v1.min.js'></script><script>var pymParent = new pym.Parent('coralStreamEmbed', '${window.location.protocol}//${window.location.host}/embed/stream', {title: 'Comments'});</script>`;

    return <List>
      <ListItem className={styles.configSettingEmbed}>
        <p>{lang.t('configure.copy-and-paste')}</p>
        <textarea rows={5} type='text' className={styles.embedInput} value={embedText} readOnly={true}/>
        <Button raised colored className={styles.copyButton} onClick={this.copyToClipBoard}>
          {lang.t('embedlink.copy')}
        </Button>
        <div className={styles.copiedText}>{this.state.copied && 'Copied!'}</div>
      </ListItem>
    </List>;
  }

  changeSection (activeSection) {
    this.setState({activeSection});
  }

  render () {
    let pageTitle = this.state.activeSection === 'comments'
      ? lang.t('configure.comment-settings')
      : lang.t('configure.embed-comment-stream');

    if (this.props.fetchingSettings) {
      pageTitle += ' - Loading...';
    }

    return (
        <div className={styles.container}>
          <div className={styles.leftColumn}>
            <List>
              <ListItem className={styles.settingOption}>
                <ListItemContent
                  onClick={this.changeSection.bind(this, 'comments')}
                  icon='settings'>{lang.t('configure.comment-settings')}</ListItemContent>
              </ListItem>
              <ListItem className={styles.settingOption}>
                <ListItemContent
                  onClick={this.changeSection.bind(this, 'embed')}
                  icon='code'>{lang.t('configure.embed-comment-stream')}</ListItemContent>
              </ListItem>
              <ListItem className={styles.settingOption}>
                <ListItemContent
                  onClick={this.changeSection.bind(this, 'wordlist')}
                  icon='settings'>{lang.t('configure.wordlist')}</ListItemContent>
              </ListItem>
            </List>
            <Button raised colored onClick={this.saveSettings}>
              <Icon name='save' /> {lang.t('configure.save-changes')}
            </Button>
          </div>
          <div className={styles.mainContent}>
            <h1>{pageTitle}</h1>
            { this.props.saveFetchingError }
            { this.props.fetchSettingsError }
            {
              this.state.activeSection === 'comments'
              ? this.getCommentSettings()
              : this.getEmbed()
            }
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => state.settings.toJS();
export default connect(mapStateToProps)(Configure);

const lang = new I18n(translations);
