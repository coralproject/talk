import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { Component, ReactNode } from "react";
import { Step, StepBar } from "talk-ui/components";

import { WizardProps } from "../components/Wizard";
import Header from "./Header";
import * as styles from "./Wizard.css";

export interface WizardProps {
  currentStep: number;
  onGoToNextStep?: () => void;
  onGoToPreviousStep?: () => void;
  onGoToStep: (step: number) => void;
  className?: string;
  children: ReactNode;
}

export interface WizardChildProps {
  currentStep?: number;
  onGoToNextStep?: () => void;
  onGoToPreviousStep?: () => void;
  onGoToStep?: (step: number) => void;
}

class Wizard extends Component<WizardProps> {
  public render() {
    const {
      children,
      currentStep,
      onGoToNextStep,
      onGoToPreviousStep,
      onGoToStep,
      className,
    } = this.props;

    const wizardChildren = React.Children.toArray(children);
    const wizardChildrenToRender = wizardChildren
      .filter((child, i) => i === currentStep)
      .map((child: React.ReactElement<any>, index: number) =>
        React.cloneElement(child, {
          currentStep,
          onGoToNextStep,
          onGoToPreviousStep,
          onGoToStep,
        })
      );

    return (
      <div className={cn(className, styles.root)}>
        <Header main={currentStep === 0} />
        {currentStep !== 0 &&
          currentStep !== wizardChildren.length - 1 && (
            <StepBar currentStep={currentStep - 1} className={styles.stepBar}>
              <Step hidden>Start</Step>
              <Step>
                <Localized id="install-createYourAccount-stepTitle">
                  <span>Create Admin Account</span>
                </Localized>
              </Step>
              <Step>
                <Localized id="install-addOrganization-stepTitle">
                  <span>Add Organization Details</span>
                </Localized>
              </Step>
              <Step>
                <Localized id="install-permittedDomains-stepTitle">
                  <span>Add Permitted Domains</span>
                </Localized>
              </Step>
              <Step hidden>Finish</Step>
            </StepBar>
          )}
        <section className={styles.section}>{wizardChildrenToRender}</section>
      </div>
    );
  }
}

export default Wizard;
