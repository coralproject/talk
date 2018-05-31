import React from 'react';
import PropTypes from 'prop-types';
import styles from './External.css';
import Slot from 'coral-framework/components/Slot';
import IfSlotIsNotEmpty from 'coral-framework/components/IfSlotIsNotEmpty';

const External = ({ slot }) => (
  <IfSlotIsNotEmpty slot={slot}>
    <div>
      <div className={styles.external}>
        <Slot fill={slot} className={styles.slot} />
      </div>
      <div className={styles.separator}>
        <h5>Or</h5>
      </div>
    </div>
  </IfSlotIsNotEmpty>
);

External.propTypes = {
  slot: PropTypes.string.isRequired,
};

export default External;
