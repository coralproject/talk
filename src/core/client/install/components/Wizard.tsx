import React, { Component, ReactNode } from "react";
import { WizardProps } from "../components/Wizard";

export interface WizardProps {
  currentStep: number;
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  goToStep: (step: number) => void;
  className?: string;
  children: ReactNode;
}

export interface WizardChildProps {
  currentStep?: number;
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  goToStep?: (step: number) => void;
}

class Wizard extends Component<WizardProps> {
  public render() {
    const {
      children,
      currentStep,
      goToNextStep,
      goToPreviousStep,
      goToStep,
      className,
    } = this.props;

    const wizardChilds = React.Children.toArray(children)
      .filter((child, i) => i === currentStep)
      .map((child: React.ReactElement<any>, index: number) =>
        React.cloneElement(child, {
          currentStep,
          goToNextStep,
          goToPreviousStep,
          goToStep,
        })
      );

    return <section className={className}>{wizardChilds}</section>;
  }
}

export default Wizard;
