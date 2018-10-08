import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { Button, Flex, Typography } from "talk-ui/components";
import { WizardChildProps } from "../../components/Wizard";

class FinalStep extends Component<WizardChildProps> {
  public render() {
    return (
      <Flex direction="column" justifyContent="center" itemGutter="double">
        <Typography variant="bodyCopy">
          <Localized id="install-finalStep-description">
            Thanks for installing Talk! We sent an email to verify your email
            address. While you finish setting up the account, you can start
            engaging with your readers now.
          </Localized>
        </Typography>
        <Flex direction="row" itemGutter justifyContent="center">
          <Button
            anchor
            color="regular"
            variant="filled"
            href="https://docs.coralproject.net"
            target="_blank"
          >
            <Localized id="install-finalStep-goToTheDocs">
              Go to the Docs
            </Localized>
          </Button>
          <Button anchor color="primary" variant="filled" href="/admin">
            <Localized id="install-finalStep-goToAdmin">Go to Admin</Localized>
          </Button>
        </Flex>
      </Flex>
    );
  }
}

export default FinalStep;
