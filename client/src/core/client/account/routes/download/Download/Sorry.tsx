import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

const Sorry: FunctionComponent = () => {
  return (
    <CallOut
      color="error"
      icon={<Icon>error</Icon>}
      titleWeight="semiBold"
      title={
        <Localized id="download-landingPage-sorry">
          Your download link is invalid.
        </Localized>
      }
    />
  );
};

export default Sorry;
