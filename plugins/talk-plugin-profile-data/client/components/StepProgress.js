import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './StepProgress.css';
import { Icon } from 'plugin-api/beta/client/components/ui';

const CheckItem = ({ current = false, completed = false }) => (
  <span
    className={cn(styles.step, {
      [styles.current]: current,
      [styles.completed]: completed,
    })}
  >
    <Icon name="check_circle" className={styles.icon} />
  </span>
);

CheckItem.propTypes = {
  current: PropTypes.bool.isRequired,
  completed: PropTypes.bool.isRequired,
};

const Line = () => <hr className={styles.line} />;

class StepProgress extends React.Component {
  render() {
    const { currentStep, totalSteps } = this.props;
    return (
      <div className={styles.container}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <CheckItem
            key={`step_${i}`}
            completed={i < currentStep}
            current={currentStep === i}
          />
        ))}
        <Line />
      </div>
    );
  }
}

StepProgress.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
};

export default StepProgress;
