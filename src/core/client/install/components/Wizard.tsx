import { Localized } from "fluent-react/compat";
import React, { Component, ReactNode } from "react";
import { Step, StepBar } from "talk-ui/components";
import { WizardProps } from "../components/Wizard";
import Header from "./Header";
import * as styles from "./Wizard.css";

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

    const wizardChildren = React.Children.toArray(children);
    const wizardChildrenToRender = wizardChildren
      .filter((child, i) => i === currentStep)
      .map((child: React.ReactElement<any>, index: number) =>
        React.cloneElement(child, {
          currentStep,
          goToNextStep,
          goToPreviousStep,
          goToStep,
        })
      );

    return (
      <div className={styles.root}>
        <Header main={currentStep === 0} />
        {currentStep !== 0 &&
          currentStep !== wizardChildren.length - 1 && (
            <StepBar currentStep={currentStep - 1} className={styles.stepBar}>
              <Step hidden>Start</Step>
              <Step>
                <Localized id="install-createYourAccount-stepTitle">
                  Create Admin Account
                </Localized>
              </Step>
              <Step>
                <Localized id="install-addOrganization-stepTitle">
                  Add Organization Details
                </Localized>
              </Step>
              <Step>
                <Localized id="install-permittedDomains-stepTitle">
                  Add Permitted Domains
                </Localized>
              </Step>
              <Step hidden>Finish</Step>
            </StepBar>
          )}
        <section className={className}>{wizardChildrenToRender}</section>
      </div>
    );
  }
}

export default Wizard;
