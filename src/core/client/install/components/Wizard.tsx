import React, { Component, ReactNode } from "react";
import { WizardProps } from "../components/Wizard";

export interface WizardProps {
  currentStep: number;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  children: ReactNode;
}

export interface WizardChildProps {
  currentStep?: number;
  nextStep?: () => void;
  previousStep?: () => void;
  goToStep?: (step: number) => void;
}

class Wizard extends Component<WizardProps> {
  public render() {
    const {
      children,
      currentStep,
      nextStep,
      previousStep,
      goToStep,
    } = this.props;

    const wizardChilds = React.Children.toArray(children)
      .filter((child, i) => i === currentStep)
      .map((child: React.ReactElement<any>, index: number) =>
        React.cloneElement(child, {
          currentStep,
          nextStep,
          previousStep,
          goToStep,
        })
      );

    return <section>{wizardChilds}</section>;
  }
}

export default Wizard;
