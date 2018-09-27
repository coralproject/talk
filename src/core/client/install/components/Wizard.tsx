import React, { Component, ReactNode } from "react";

interface WizardProps {
  currentStep: number;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
}

class Wizard extends Component<WizardProps> {
  public render() {
    const { children, currentStep, ...rest } = this.props;
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
  }
}

export default Wizard;
