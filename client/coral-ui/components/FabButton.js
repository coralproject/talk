import React from 'react';
import styles from './FabButton.css';
import { FABButton, Icon } from 'react-mdl';

const FabButton = ({ cStyle = 'local', icon, className, ...props }) => (
  <FABButton
    className={`${styles.base} ${styles[`type--${cStyle}`]} ${
      className ? className : ''
    }`}
    {...props}
  >
    <Icon name={icon} />
  </FABButton>
);

export default FabButton;
