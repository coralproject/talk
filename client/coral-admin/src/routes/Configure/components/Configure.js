import React, {Component} from 'react';

import {Button, List, Item, Card, Spinner} from 'coral-ui';
import styles from './Configure.css';
import StreamSettings from './StreamSettings';
import ModerationSettings from './ModerationSettings';
import TechSettings from './TechSettings';
import t from 'coral-framework/services/i18n';
import {can} from 'coral-framework/services/perms';

export default class Configure extends Component {

  state = {
    activeSection: 'stream',
    changed: false,
    errors: {}
  };

  saveSettings = () => {
    this.props.saveSettingsToServer();
    this.setState({changed: false});
  }

  changeSection = (activeSection) => {
    this.setState({activeSection});
  }

  onChangeWordlist = (listName, list) => {
    this.setState({changed: true});
    this.props.updateWordlist(listName, list);
  }

  onChangeDomainlist = (listName, list) => {
    this.setState({changed: true});
    this.props.updateDomainlist(listName, list);
  }

  onSettingUpdate = (setting) => {
    this.setState({changed: true});
    this.props.updateSettings(setting);
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
    let sectionComponent;
    switch(section){
    case 'stream':
      sectionComponent = <StreamSettings
        settings={this.props.settings}
        updateSettings={this.onSettingUpdate}
        errors={this.state.errors}
        settingsError={this.onSettingError}/>;
      break;
    case 'moderation':
      sectionComponent = <ModerationSettings
        onChangeWordlist={this.onChangeWordlist}
        settings={this.props.settings}
        updateSettings={this.onSettingUpdate} />;
      break;
    case 'tech':
      sectionComponent = <TechSettings
        onChangeDomainlist={this.onChangeDomainlist}
        settings={this.props.settings}
        updateSettings={this.onSettingUpdate} />;
    }

    if (this.props.settings.fetchingSettings) {
      return <Card shadow="4"><Spinner/>Loading settings...</Card>;
    }

    return (
      <div className={styles.settingsSection}>
        <h3>{pageTitle}</h3>
        {sectionComponent}
      </div>
    );
  }

  getPageTitle (section) {
    switch(section) {
    case 'stream':
      return t('configure.stream_settings');
    case 'moderation':
      return t('configure.moderation_settings');
    case 'tech':
      return t('configure.tech_settings');
    default:
      return '';
    }
  }

  render () {
    const {activeSection} = this.state;
    const section = this.getSection(activeSection);
    const {auth: {user}} = this.props;

    if (!can(user, 'UPDATE_CONFIG')) {
      return <p>You must be an administrator to access config settings. Please find the nearest Admin and ask them to level you up!</p>;
    }

    const showSave = Object.keys(this.state.errors).reduce(
      (bool, error) => this.state.errors[error] ? false : bool, this.state.changed);

    return (
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <List onChange={this.changeSection} activeItem={activeSection}>
            <Item itemId='stream' icon='speaker_notes'>
              {t('configure.stream_settings')}
            </Item>
            <Item itemId='moderation' icon='thumbs_up_down'>
              {t('configure.moderation_settings')}
            </Item>
            <Item itemId='tech' icon='code'>
              {t('configure.tech_settings')}
            </Item>
          </List>
          <div className={styles.saveBox}>
            {
              showSave ?
                <Button
                  raised
                  onClick={this.saveSettings}
                  className={styles.changedSave}
                  icon='check'
                  full
                >
                  {t('configure.save_changes')}
                </Button>
                :
                <Button
                  raised
                  disabled
                  icon='check'
                  full
                >
                  {t('configure.save_changes')}
                </Button>
            }
          </div>

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
