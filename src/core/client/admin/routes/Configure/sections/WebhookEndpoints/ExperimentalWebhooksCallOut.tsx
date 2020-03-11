import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import ExperimentalCallOut from "coral-admin/components/ExperimentalCallOut";

const ExperimentalWebhooksCallOut: FunctionComponent = () => (
  <Localized id="configure-webhooks-experimentalFeature">
    <ExperimentalCallOut>
      The webhook feature is currently in active development. Events may be
      added or removed. Ensure you check the release notes for updates.
    </ExperimentalCallOut>
  </Localized>
);

export default ExperimentalWebhooksCallOut;
