import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'plugin-api/beta/client/services';
import { Checkbox } from 'plugin-api/beta/client/components/ui';
import styles from './Toggle.css';

class Toggle extends React.Component {
  render() {
    const { checked, onChange } = this.props;
    return (
      <div className={styles.toggle}>
        <div className={styles.description}>
          {t('talk-plugin-notifications-category-reply.toggle_description')}
          <Checkbox checked={checked} onChange={onChange} />
        </div>
      </div>
    );
  }
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Toggle;
