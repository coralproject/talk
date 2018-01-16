import React, { Component } from 'react';

import { Button, List, Item } from 'coral-ui';
import styles from './Configure.css';
import StreamSettings from '../containers/StreamSettings';
import ModerationSettings from '../containers/ModerationSettings';
import TechSettings from '../containers/TechSettings';
import t from 'coral-framework/services/i18n';
import { can } from 'coral-framework/services/perms';
import PropTypes from 'prop-types';

export default class Configure extends Component {
  getSectionComponent(section) {
    switch (section) {
      case 'stream':
        return StreamSettings;
      case 'moderation':
        return ModerationSettings;
      case 'tech':
        return TechSettings;
    }
    throw new Error(`Unknown section ${section}`);
  }

  render() {
    const {
      auth: { user },
      canSave,
      savePending,
      setActiveSection,
      activeSection,
    } = this.props;
    const SectionComponent = this.getSectionComponent(activeSection);

    if (!can(user, 'UPDATE_CONFIG')) {
      return (
        <p>
          You must be an administrator to access config settings. Please find
          the nearest Admin and ask them to level you up!
        </p>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <List onChange={setActiveSection} activeItem={activeSection}>
            <Item itemId="stream" icon="speaker_notes">
              {t('configure.stream_settings')}
            </Item>
            <Item itemId="moderation" icon="thumbs_up_down">
              {t('configure.moderation_settings')}
            </Item>
            <Item itemId="tech" icon="code">
              {t('configure.tech_settings')}
            </Item>
          </List>
          <div className={styles.saveBox}>
            {canSave ? (
              <Button
                raised
                onClick={savePending}
                className={styles.changedSave}
                icon="check"
                full
              >
                {t('configure.save_changes')}
              </Button>
            ) : (
              <Button raised disabled icon="check" full>
                {t('configure.save_changes')}
              </Button>
            )}
          </div>
        </div>
        <div className={styles.mainContent}>
          <SectionComponent
            data={this.props.data}
            root={this.props.root}
            settings={this.props.settings}
          />
        </div>
      </div>
    );
  }
}

Configure.propTypes = {
  notify: PropTypes.func.isRequired,
  savePending: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
};
