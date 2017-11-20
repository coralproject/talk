import React from 'react';
import {Button} from 'coral-ui';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';
import styles from './Settings.css';
import Configuration from './Configuration';

class Settings extends React.Component {
  render() {
    const {settings: {moderation}, toggleModeration} = this.props;
    const changed = false;
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h3>{t('configure.title')}</h3>
          <Button
            type="submit"
            className={cn(styles.apply, 'talk-embed-stream-configuration-submit-button')}
            checked={changed}
            cStyle={changed ? 'green' : 'darkGrey'}
          >
            {t('configure.apply')}
          </Button>
          <p className={styles.description}>{t('configure.description')}</p>
        </div>
        <div className={styles.list}>
          <Configuration
            checked={moderation === 'PRE'}
            title={t('configure.enable_premod')}
            onCheckbox={toggleModeration}
          >
            {t('configure.enable_premod_description')}
          </Configuration>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  settings: PropTypes.object.isRequired,
  toggleModeration: PropTypes.func.isRequired,
};

export default Settings;
