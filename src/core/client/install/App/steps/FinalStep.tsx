import { Localized } from "@fluent/react/compat";
import React, { Component } from "react";

import { urls } from "coral-framework/helpers";
import { Button, Flex, Typography } from "coral-ui/components/v2";

class FinalStep extends Component {
  public render() {
    return (
      <Flex direction="column" justifyContent="center" itemGutter="double">
        <Localized id="install-finalStep-description">
          <Typography variant="bodyCopy">
            Continue to Coral Admin to complete the setup of your organization
            and site.
          </Typography>
        </Localized>
        <Flex direction="row" itemGutter justifyContent="center">
          <Localized id="install-finalStep-goToAdmin">
            <Button
              anchor
              color="regular"
              variant="regular"
              href={urls.admin.moderate}
            >
              Go to Admin
            </Button>
          </Localized>
        </Flex>
      </Flex>
    );
  }
}

export default FinalStep;
