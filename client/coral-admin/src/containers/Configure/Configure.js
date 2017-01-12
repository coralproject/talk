import React from 'react';
import {connect} from 'react-redux';
import {
  fetchSettings,
  updateSettings,
  saveSettingsToServer,
  updateWordlist,
} from '../../actions/settings';

import {Button, Icon, List, Item} from 'coral-ui';
import styles from './Configure.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import EmbedLink from './EmbedLink';
import CommentSettings from './CommentSettings';
import Wordlist from './Wordlist';
import has from 'lodash/has';

class Configure extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      activeSection: 'comments',
      changed: false,
      errors: {}
    };
  }

  componentWillMount = () => {
    this.props.dispatch(fetchSettings());
  }

  saveSettings = () => {
    this.props.dispatch(saveSettingsToServer());
    this.setState({changed: false});
  }

  changeSection = (activeSection) => () => {
    this.setState({activeSection});
  }

  onChangeWordlist = (listName, list) => {
    this.setState({changed: true});
    this.props.dispatch(updateWordlist(listName, list));
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
      return has(this, 'props.settings.wordlist')
        ? <Wordlist
          bannedWords={this.props.settings.wordlist.banned}
          suspectWords={this.props.settings.wordlist.suspect}
          onChangeWordlist={this.onChangeWordlist} />
        : <p>loading wordlists</p>;
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
    const {activeSection} = this.state;
    const section = this.getSection(activeSection);

    const showSave = Object.keys(this.state.errors).reduce(
      (bool, error) => this.state.errors[error] ? false : bool, this.state.changed);

    return (
        <div className={styles.container}>
          <div className={styles.leftColumn}>
            <List onChange={this.changeSection} activeItem={activeSection}>
              <Item itemId='comments' icon="settings">
                {lang.t('configure.comment-settings')}
              </Item>
              <Item itemId='embed' icon='code'>
                {lang.t('configure.embed-comment-stream')}
              </Item>
              <Item itemId='wordlist' icon='settings'>
                {lang.t('configure.wordlist')}
              </Item>
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
