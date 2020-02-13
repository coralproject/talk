import { Localized } from "fluent-react/compat";
import { Match, Router, withRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { urls } from "coral-framework/helpers";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { AddWebhookEndpointContainer_settings } from "coral-admin/__generated__/AddWebhookEndpointContainer_settings.graphql";

import { ConfigureWebhookEndpointForm } from "../ConfigureWebhookEndpointForm";

interface Props {
  router: Router;
  match: Match;
  settings: AddWebhookEndpointContainer_settings;
}

const AddWebhookEndpointContainer: FunctionComponent<Props> = ({
  settings,
  router,
}) => {
  const onCancel = useCallback(() => {
    router.push(urls.admin.webhooks);
  }, [router]);

  return (
    <HorizontalGutter size="double">
      <ConfigBox
        title={
          <Localized id="configure-webhooks-addEndpoint">
            <Header>Add a webhook endpoint</Header>
          </Localized>
        }
      >
        <ConfigureWebhookEndpointForm
          settings={settings}
          webhookEndpoint={null}
          onCancel={onCancel}
        />
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withRouter(
  withFragmentContainer<Props>({
    settings: graphql`
      fragment AddWebhookEndpointContainer_settings on Settings {
        ...ConfigureWebhookEndpointForm_settings
      }
    `,
  })(AddWebhookEndpointContainer)
);

export default enhanced;
