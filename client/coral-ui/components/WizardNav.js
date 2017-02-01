import React, {PropTypes} from 'react';
import styles from './WizardNav.css';

const WizardNav = props => {
  const {goToStep, currentStep, items} = props;
  return (
    <nav className={styles.WizardNav}>
      <ul>
        {
          items.map((item, i) => (
            <li
              key={i}
              className={`${currentStep === item.step ? styles.active : ''} ${item.step < currentStep ? styles.done : ''}`}
              onClick={() => goToStep(item.step)}>
              {item.text}<span/>
            </li>
          ))
        }
      </ul>
    </nav>
  );
};

WizardNav.propTypes = {
  goToStep: PropTypes.func.isRequired,
  currentStep: PropTypes.number.isRequired
};

export default WizardNav;
