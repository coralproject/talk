import React, {Component} from 'react';

import {Button, List, Item} from 'coral-ui';
import styles from './Configure.css';
import StreamSettings from '../containers/StreamSettings';
import ModerationSettings from './ModerationSettings';
import TechSettings from './TechSettings';
import t from 'coral-framework/services/i18n';
import {can} from 'coral-framework/services/perms';
import PropTypes from 'prop-types';

export default class Configure extends Component {

  state = {
    activeSection: 'stream',
  };

  changeSection = (activeSection) => {
    this.setState({activeSection});
  }

  getSection (section) {
    let sectionComponent;
    switch(section){
    case 'stream':
      sectionComponent = <StreamSettings
        data={this.props.data}
        root={this.props.root}
        settings={this.props.settings}
      />;
      break;
    case 'moderation':
      sectionComponent = <ModerationSettings
        onChangeWordlist={this.props.updateWordlist}
        settings={this.props.settings}
        updateSettings={this.props.updateSettings}
      />;
      break;
    case 'tech':
      sectionComponent = <TechSettings
        onChangeDomainlist={this.props.updateDomainlist}
        settings={this.props.settings}
        updateSettings={this.props.updateSettings}
      />;
    }

    return (
      <div className={styles.settingsSection}>
        {sectionComponent}
      </div>
    );
  }

  render () {
    const {activeSection} = this.state;
    const section = this.getSection(activeSection);
    const {auth: {user}, canSave, savePending} = this.props;

    if (!can(user, 'UPDATE_CONFIG')) {
      return <p>You must be an administrator to access config settings. Please find the nearest Admin and ask them to level you up!</p>;
    }

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
              canSave ?
                <Button
                  raised
                  onClick={savePending}
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
          {section}
        </div>
      </div>
    );
  }
}

Configure.propTypes = {
  notify: PropTypes.func.isRequired,
  updateWordlist: PropTypes.func.isRequired,
  updateDomainlist: PropTypes.func.isRequired,
  updateSettings: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  savePending: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
};
