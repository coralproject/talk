import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import { Button, Flex, Typography } from "talk-ui/components";

interface InitialStepProps {
  onGoToNextStep: () => void;
}

class InitialStep extends Component<InitialStepProps> {
  public render() {
    return (
      <Flex direction="column" justifyContent="center" itemGutter="double">
        <Localized id="install-initialStep-copy">
          <Typography variant="bodyCopy">
            The remainder of the Talk installation will take about ten minutes.
            Once you complete the following three steps, you will have a free
            installation and provision Mongo and Redis.
          </Typography>
        </Localized>
        <Flex justifyContent="center">
          <Localized id="install-initialStep-getStarted">
            <Button
              onClick={this.props.onGoToNextStep}
              color="primary"
              variant="filled"
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
