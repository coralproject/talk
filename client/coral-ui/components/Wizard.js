import React from 'react';
import PropTypes from 'prop-types';

const Wizard = props => {
  const { children, currentStep, ...rest } = props;
  return (
    <section>
      {React.Children.toArray(children)
        .filter((child, i) => i === currentStep)
        .map((child, i) =>
          React.cloneElement(child, {
            i,
            currentStep,
            ...rest,
          })
        )}
    </section>
  );
};

Wizard.propTypes = {
  currentStep: PropTypes.number.isRequired,
  nextStep: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  goToStep: PropTypes.func.isRequired,
};

export default Wizard;
