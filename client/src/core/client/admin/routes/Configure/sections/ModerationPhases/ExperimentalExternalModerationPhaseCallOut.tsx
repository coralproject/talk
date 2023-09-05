import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import ExperimentalCallOut from "coral-admin/components/ExperimentalCallOut";
import { ExternalLink } from "coral-framework/lib/i18n/components";

const ExperimentalExternalModerationPhaseCallOut: FunctionComponent = () => (
  <Localized
    id="configure-moderationPhases-experimentalFeature"
    elems={{
      ContactUsLink: <ExternalLink href="https://coralproject.net/contact/" />,
    }}
  >
    <ExperimentalCallOut>
      The custom moderation phases feature is currently in active development.
      Please{" "}
      <ExternalLink href="https://coralproject.net/contact/">
        contact us with any feedback or requests
      </ExternalLink>
      .
    </ExperimentalCallOut>
  </Localized>
);

export default ExperimentalExternalModerationPhaseCallOut;
