import React, { Component } from "react";
import { Button, Flex, Typography } from "talk-ui/components";

import { WizardChildProps } from "../../components/Wizard";

class FinalStep extends Component<WizardChildProps> {
  // tslint:disable-next-line:no-empty
  private handleLaunchTalk = () => {};

  // tslint:disable-next-line:no-empty
  private handleClose = () => {};

  public render() {
    return (
      <Flex direction="column" justifyContent="center" itemGutter="double">
        <Typography variant="bodyCopy">
          Thanks for installing Talk! We sent an email to verify your email
          address. While you finish setting up the account, you can start
          engaging with your readers now.
        </Typography>
        <Flex direction="row" itemGutter>
          <Button onClick={this.handleClose} color="regular" variant="filled">
            Close this Installer
          </Button>
          <Button
            onClick={this.handleLaunchTalk}
            color="primary"
            variant="filled"
          >
            Go to Admin
          </Button>
        </Flex>
      </Flex>
    );
  }
}

export default FinalStep;
