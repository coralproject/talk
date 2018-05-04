import React from 'react';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import { Button, List, Item } from 'coral-ui';
import { can } from 'coral-framework/services/perms';
import styles from './Configure.css';
import SaveChangesDialog from './SaveChangesDialog';

class Configure extends React.Component {
  render() {
    const {
      canSave,
      currentUser,
      root,
      savePending,
      settings,
      clearPending,
    } = this.props;

    if (!can(currentUser, 'UPDATE_CONFIG')) {
      return <p>{t('configure.access_message')}</p>;
    }

    const passProps = {
      root,
      settings,
      savePending,
      clearPending,
      canSave,
    };

    return (
      <div className={styles.container}>
        <SaveChangesDialog
          saveDialog={this.props.saveDialog}
          hideSaveDialog={this.props.hideSaveDialog}
          saveChanges={this.props.saveChanges}
          discardChanges={this.props.discardChanges}
        />
        <div className={styles.leftColumn}>
          <List
            onChange={this.props.handleSectionChange}
            activeItem={this.props.activeSection}
          >
            <Item itemId="stream" icon="speaker_notes">
              {t('configure.stream_settings')}
            </Item>
            <Item itemId="moderation" icon="thumbs_up_down">
              {t('configure.moderation_settings')}
            </Item>
            <Item itemId="tech" icon="code">
              {t('configure.tech_settings')}
            </Item>
            <Item itemId="organization" icon="people">
              {t('configure.organization_information')}
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
          {React.cloneElement(this.props.children, passProps)}
        </div>
      </div>
    );
  }
}

Configure.propTypes = {
  savePending: PropTypes.func.isRequired,
  saveChanges: PropTypes.func.isRequired,
  discardChanges: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
  handleSectionChange: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  saveDialog: PropTypes.bool,
  hideSaveDialog: PropTypes.func.isRequired,
  clearPending: PropTypes.func.isRequired,
};

export default Configure;
