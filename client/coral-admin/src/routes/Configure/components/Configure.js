import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';
import { Button, List, Item, Dialog } from 'coral-ui';
import { can } from 'coral-framework/services/perms';
import styles from './Configure.css';

class Configure extends React.Component {
  render() {
    const { canSave, currentUser, root, savePending, settings } = this.props;

    if (!can(currentUser, 'UPDATE_CONFIG')) {
      return <p>{t('configure.access_message')}</p>;
    }

    const passProps = {
      root,
      settings,
    };

    return (
      <div className={styles.container}>
        <Dialog
          className={cn(styles.dialog, 'talk-admin-configure-save-dialog')}
          id="saveDialog"
          open={this.props.saveDialog}
          onCancel={this.props.hideSaveDialog}
          title={t('configure.unsaved_changes')}
        >
          {t('configure.save_dialog_copy')}
          <Button onClick={this.props.saveChanges}>
            {t('configure.save_settings')}
          </Button>
          <Button onClick={this.props.discardChanges}>
            {t('configure.discard_changes')}
          </Button>
        </Dialog>
        <div className={styles.leftColumn}>
          <List
            onChange={this.props.setActiveSection}
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
  setActiveSection: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  saveDialog: PropTypes.bool,
  hideSaveDialog: PropTypes.func.isRequired,
};

export default Configure;
