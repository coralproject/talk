import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import ExperimentalCallOut from "coral-admin/components/ExperimentalCallOut";
import { ExternalLink } from "coral-framework/lib/i18n/components";

const ExperimentalWebhooksCallOut: FunctionComponent = () => (
  <Localized
    id="configure-webhooks-experimentalFeature"
    elems={{
      ContactUsLink: <ExternalLink href="https://coralproject.net/contact/" />,
    }}
  >
    <ExperimentalCallOut>
      The webhook feature is currently in active development. Events may be
      added or removed. Please{" "}
      <ExternalLink href="https://coralproject.net/contact/">
        contact us with any feedback or requests
      </ExternalLink>
      .
    </ExperimentalCallOut>
  </Localized>
);

export default ExperimentalWebhooksCallOut;
