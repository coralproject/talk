import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { Component } from "react";

import { urls } from "coral-framework/helpers";
import { Button, Flex, Typography } from "coral-ui/components";

class FinalStep extends Component {
  public render() {
    return (
      <Flex direction="column" justifyContent="center" itemGutter="double">
        <Localized
          id="install-finalStep-description"
          $url={<Link to={urls.admin.moderate}>{urls.admin.moderate}</Link>}
        >
          <Typography variant="bodyCopy">
            Thanks for installing Coral! We sent an email to verify your email
            address. While you finish setting up the account, you can start
            engaging with your readers now.
          </Typography>
        </Localized>
        <Flex direction="row" itemGutter justifyContent="center">
          <Localized id="install-finalStep-goToAdmin">
            <Button
              anchor
              color="primary"
              variant="filled"
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
