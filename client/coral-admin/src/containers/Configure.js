
import React from 'react';
import {connect} from 'react-redux';
import {fetchSettings, updateSettings, saveSettingsToServer} from '../actions/settings';
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
import I18n from 'coral-framework/i18n/i18n';
import translations from '../translations';

class Configure extends React.Component {
  constructor (props) {
    super(props);

    this.state = {activeSection: 'comments', copied: false};

    this.copyToClipBoard = this.copyToClipBoard.bind(this);
    this.updateModeration = this.updateModeration.bind(this);
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

  updateInfoBoxContent () {
    const infoBoxContent = this.props.settings.infoBoxContent;
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
        Enable pre-moderation
      </ListItem>
      <ListItem className={styles.configSettingInfoBox}>
        <ListItemAction>
          <Checkbox
            onClick={this.updateInfoBoxEnable.bind(this)}
            checked={this.props.settings.infoBoxEnable} />
        </ListItemAction>
        <Textfield
          onChange={this.updateInfoBoxContent}
          expandable
          label='Include your text here'
          value={this.props.settings.infoBoxContent}/>
      </ListItem>
      {/*
      <ListItem className={styles.configSetting}>
        <ListItemAction><Checkbox /></ListItemAction>
        Include Comment Stream Description for Readers
      </ListItem>
      <ListItem className={styles.configSetting}>
        <ListItemAction><Checkbox /></ListItemAction>
        Limit Comment Length
        <Textfield
          pattern='-?[0-9]*(\.[0-9]+)?'
          error='Input is not a number!'
          label='Maximum Characters' />
      </ListItem>
    */}
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
    const embedText = `<div id='coralStreamEmbed'></div><script type='text/javascript' src='http://pym.nprapps.org/pym.v1.min.js'></script><script>var pymParent = new pym.Parent('coralStreamEmbed', '${window.location.protocol}//${window.location.host}/embed/stream', {});</script>`;

    return <List>
      <ListItem className={styles.configSettingEmbed}>
        <p>Copy and paste code below into your CMS to embed your comment box in your articles</p>
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
      ? 'Comment Settings'
      : 'Embed Comment Stream';

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
                  icon='settings'>Comment Settings</ListItemContent>
              </ListItem>
              <ListItem className={styles.settingOption}>
                <ListItemContent
                  onClick={this.changeSection.bind(this, 'embed')}
                  icon='code'>Embed Comment Stream</ListItemContent>
              </ListItem>
            </List>
            <Button raised colored onClick={this.saveSettings}>
              <Icon name='save' /> Save Changes
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
