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

    this.state = {
      activeSection: 'comments',
      wordlist: [],
      changed: false,
      errors: {}
    };
  }

  componentWillMount = () => {
    this.props.dispatch(fetchSettings());
  }

  componentWillUpdate = (newProps) => {
    if ((!this.props.settings
      || !this.props.settings.wordlist)
      && newProps.settings.wordlist
      && newProps.settings.wordlist.length !== 0 ) {
      console.log('wordlist?', newProps.settings.wordlist);
      this.setState({wordlist: newProps.settings.wordlist.banned.join(', ')});
    }
  }

  saveSettings = () => {
    this.props.dispatch(saveSettingsToServer());
    this.setState({changed: false});
  }

  changeSection = (activeSection) => () => {
    this.setState({activeSection});
  }

  onChangeWordlist = (event) => {
    event.preventDefault();
    const newlist = event.target.value;
    this.setState({wordlist: newlist.toLowerCase(), changed: true});
    this.props.dispatch(updateSettings({
      wordlist: newlist.toLowerCase()
        .split(',')
        .map((word) => word.trim())
    }));
  }

  onSettingUpdate = (setting) => {
    this.setState({changed: true});
    this.props.dispatch(updateSettings(setting));
  }

  // Sets an arbitrary error string and a boolean state.
  // This allows the system to track multiple errors.
  onSettingError = (error, state) => {
    this.setState((prevState) => {
      prevState.errors[error] = state;
      return prevState;
    });
  }

  getSection (section) {
    const pageTitle = this.getPageTitle(section);
    switch(section){
    case 'comments':
      return <CommentSettings
        title={pageTitle}
        fetchingSettings={this.props.fetchingSettings}
        settings={this.props.settings}
        updateSettings={this.onSettingUpdate}
        errors={this.state.errors}
        settingsError={this.onSettingError}/>;
    case 'embed':
      return <EmbedLink title={pageTitle} />;
    case 'wordlist':
      return <Wordlist
        bannedWords={this.state.wordlist}
        onChangeWordlist={this.onChangeWordlist}/>;
    }
  }

  getPageTitle (section) {
    switch(section) {
    case 'comments':
      return lang.t('configure.comment-settings');
    case 'embed':
      return lang.t('configure.embed-comment-stream');
    default:
      return '';
    }
  }

  render () {
    const section = this.getSection(this.state.activeSection);

    const showSave = Object.keys(this.state.errors).reduce(
      (bool, error) => this.state.errors[error] ? false : bool, this.state.changed);

    return (
        <div className={styles.container}>
          <div className={styles.leftColumn}>
            <List>
              <ListItem className={styles.settingOption}>
                <ListItemContent
                  onClick={this.changeSection('comments')}
                  icon='settings'>{lang.t('configure.comment-settings')}</ListItemContent>
              </ListItem>
              <ListItem className={styles.settingOption}>
                <ListItemContent
                  onClick={this.changeSection('embed')}
                  icon='code'>{lang.t('configure.embed-comment-stream')}</ListItemContent>
              </ListItem>
              <ListItem className={styles.settingOption}>
                <ListItemContent
                  onClick={this.changeSection('wordlist')}
                  icon='settings'>{lang.t('configure.wordlist')}</ListItemContent>
              </ListItem>
            </List>
            {
              showSave ?
              <Button
                raised
                onClick={this.saveSettings}
                className={styles.changedSave}>
                <Icon name='check' /> {lang.t('configure.save-changes')}
              </Button>
              : <Button
              raised
              disabled>
              {lang.t('configure.save-changes')}
            </Button>
            }

          </div>
          <div className={styles.mainContent}>
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
