import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'plugin-api/beta/client/services';
import { Checkbox } from 'plugin-api/beta/client/components/ui';
import styles from './Toggle.css';
import uuid from 'uuid/v4';

class Toggle extends React.Component {
  id = uuid();

  render() {
    const { checked, onChange } = this.props;
    return (
      <div className={styles.toggle}>
        <label htmlFor={this.id} className={styles.title}>
          {t('talk-plugin-notifications-category-reply.toggle_description')}
        </label>
        <Checkbox checked={checked} onChange={onChange} id={this.id} />
      </div>
    );
  }
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Toggle;
