import React from 'react';
import {connect} from 'react-redux';
import {fetchSettings, updateSettings, saveSettingsToServer} from '../../actions/settings';
import {
  List,
  ListItem,
  ListItemContent,
  Button,
  Icon
} from 'react-mdl';
import styles from './Configure.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import EmbedLink from './EmbedLink';
import CommentSettings from './CommentSettings';
import Wordlist from './Wordlist';

class Configure extends React.Component {
  constructor (props) {
    super(props);
    console.log(props);
    this.state = {
      activeSection: 'comments',
      wordlist: props.settings.wordlist && props.settings.wordlist.join(' ')
    };
    this.saveSettings = this.saveSettings.bind(this);
    this.onChangeWordlist = this.onChangeWordlist.bind(this);
  }

  componentWillMount () {
    this.props.dispatch(fetchSettings());
  }

  saveSettings () {
    this.props.dispatch(saveSettingsToServer());
  }

  changeSection (activeSection) {
    this.setState({activeSection});
  }

  onChangeWordlist (event) {
    event.preventDefault();
    const newlist = event.target.value;
    this.setState({wordlist: newlist.toLowerCase()});
    this.props.dispatch(updateSettings({
      wordlist: newlist.toLowerCase()
        .split(',')
        .map((word) => word.trim())
    }));
  }

  getSection (section) {
    switch(section){
    case 'comments':
      return <CommentSettings
        settings={this.props.settings}
        updateSettings={(setting) => this.props.dispatch(updateSettings(setting))}/>;
    case 'embed':
      return <EmbedLink/>;
    case 'wordlist':
      return <Wordlist
        wordlist={this.state.wordlist}
        onChangeWordlist={this.onChangeWordlist}/>;
    }
  }

  getPageTitle (section) {
    switch(section) {
    case 'comments':
      return lang.t('configure.comment-settings');
    case 'embed':
      return lang.t('configure.embed-comment-stream');
    case 'wordlist':
      return lang.t('configure.wordlist');
    }
  }

  render () {
    let pageTitle = this.getPageTitle(this.state.activeSection);
    const section = this.getSection(this.state.activeSection);

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
            { section }
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => state.settings.toJS();
export default connect(mapStateToProps)(Configure);

const lang = new I18n(translations);
