import React, { Component } from "react";
import { Button, HorizontalGutter, Typography } from "talk-ui/components";

import { WizardChildProps } from "../../components/Wizard";

class InitialStep extends Component<WizardChildProps> {
  private handleGoToNextStep = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  };

  public render() {
    return (
      <HorizontalGutter>
        <Typography variant="bodyCopy">
          Let's set up your Talk community in just a few short steps
        </Typography>
        <Button
          onClick={this.handleGoToNextStep}
          color="primary"
          variant="filled"
        >
          Get Started
        </Button>
      </HorizontalGutter>
    );
  }
}

export default InitialStep;
