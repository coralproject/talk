import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { urls } from "talk-framework/helpers";
import { Button, Flex, Typography } from "talk-ui/components";
import { WizardChildProps } from "../../components/Wizard";

class FinalStep extends Component<WizardChildProps> {
  public render() {
    return (
      <Flex direction="column" justifyContent="center" itemGutter="double">
        <Localized id="install-finalStep-description">
          <Typography variant="bodyCopy">
            Thanks for installing Talk! We sent an email to verify your email
            address. While you finish setting up the account, you can start
            engaging with your readers now.
          </Typography>
        </Localized>
        <Flex direction="row" itemGutter justifyContent="center">
          <Localized id="install-finalStep-goToTheDocs">
            <Button
              anchor
              color="regular"
              variant="filled"
              href="https://docs.coralproject.net"
              target="_blank"
            >
              Go to the Docs
            </Button>
          </Localized>
          <Localized id="install-finalStep-goToAdmin">
            <Button anchor color="primary" variant="filled" href={urls.admin}>
              Go to Admin
            </Button>
          </Localized>
        </Flex>
      </Flex>
    );
  }
}

export default FinalStep;
