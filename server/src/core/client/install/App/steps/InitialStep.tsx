import { Localized } from "@fluent/react/compat";
import React, { Component } from "react";

import { Button, Flex, Typography } from "coral-ui/components/v2";

interface InitialStepProps {
  onGoToNextStep: () => void;
}

class InitialStep extends Component<InitialStepProps> {
  public render() {
    return (
      <Flex direction="column" justifyContent="center" itemGutter="double">
        <Localized id="install-initialStep-theRemainder">
          <Typography variant="bodyCopy">
            The remainder of the installation wizard will take about 10 minutes.
            Once you are finished, you will have your own instance of Coral.
          </Typography>
        </Localized>
        <Flex justifyContent="center">
          <Localized id="install-initialStep-getStarted">
            <Button
              onClick={this.props.onGoToNextStep}
              color="regular"
              variant="regular"
              fullWidth={false}
            >
              Get Started
            </Button>
          </Localized>
        </Flex>
      </Flex>
    );
  }
}

export default InitialStep;
