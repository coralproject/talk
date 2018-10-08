import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { Button, Flex, Typography } from "talk-ui/components";

import { WizardChildProps } from "../../components/Wizard";

class InitialStep extends Component<WizardChildProps> {
  private handleGoToNextStep = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  };

  public render() {
    return (
      <Flex direction="column" justifyContent="center" itemGutter="double">
        <Typography variant="bodyCopy">
          <Localized id="install-initialStep-copy">
            The remainder of the Talk installation will take about ten minutes.
            Once you complete the following three steps, you will have a free
            installation and provision Mongo and Redis.
          </Localized>
        </Typography>
        <Flex justifyContent="center">
          <Button
            onClick={this.handleGoToNextStep}
            color="primary"
            variant="filled"
            fullWidth={false}
          >
            <Localized id="install-initialStep-getStarted">
              Get Started
            </Localized>
          </Button>
        </Flex>
      </Flex>
    );
  }
}

export default InitialStep;
