import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  fetchSettings,
  updateSettings,
  saveSettingsToServer,
  updateWordlist,
  updateDomainlist
} from '../../actions/settings';

import {Button, List, Item, Card, Spinner} from 'coral-ui';
import styles from './Configure.css';
import StreamSettings from './StreamSettings';
import ModerationSettings from './ModerationSettings';
import TechSettings from './TechSettings';
import t from 'coral-framework/services/i18n';

class Configure extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeSection: 'stream',
      changed: false,
      errors: {}
    };

    this.changeSection = this.changeSection.bind(this);
  }

  componentWillMount = () => {
    this.props.dispatch(fetchSettings());
  }

  saveSettings = () => {
    this.props.dispatch(saveSettingsToServer());
    this.setState({changed: false});
  }

  changeSection(activeSection) {
    this.setState({activeSection});
  }

  onChangeWordlist = (listName, list) => {
    this.setState({changed: true});
    this.props.dispatch(updateWordlist(listName, list));
  }

  onChangeDomainlist = (listName, list) => {
    this.setState({changed: true});
    this.props.dispatch(updateDomainlist(listName, list));
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

const mapStateToProps = (state) => ({
  settings: state.settings.toJS()
});
export default connect(mapStateToProps)(Configure);
