import React from 'react';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import styles from './External.css';
import { Slot } from 'plugin-api/beta/client/components';
import { IfSlotIsNotEmpty } from 'plugin-api/beta/client/components';

const External = ({ slot }) => (
  <div>
    <IfSlotIsNotEmpty slot={slot}>
      <div className={styles.external}>
        <Slot fill={slot} />
      </div>
      <div className={styles.separator}>
        <h1>{t('sign_in.or')}</h1>
      </div>
    </IfSlotIsNotEmpty>
  </div>
);

External.propTypes = {
  slot: PropTypes.string.isRequired,
};

export default External;
