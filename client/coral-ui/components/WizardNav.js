import React from 'react';
import PropTypes from 'prop-types';
import styles from './WizardNav.css';
import Icon from './Icon';

const WizardNav = props => {
  const { goToStep = () => {}, currentStep, items, icon } = props;
  return (
    <nav className={styles.WizardNav}>
      <ul>
        {items.map((item, i) => (
          <li
            key={i}
            className={`${currentStep === item.step ? styles.active : ''} ${
              item.step < currentStep ? styles.done : ''
            }`}
            onClick={() => goToStep(item.step)}
          >
            {item.text}
            {icon && <Icon name={icon} />}
            <span />
          </li>
        ))}
      </ul>
    </nav>
  );
};

WizardNav.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default WizardNav;
