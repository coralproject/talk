import { Localized } from "@fluent/react/compat";
import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { urls } from "coral-framework/helpers";
import { HorizontalGutter } from "coral-ui/components/v2";

import { AddWebhookEndpointContainer_settings$key as AddWebhookEndpointContainer_settings } from "coral-admin/__generated__/AddWebhookEndpointContainer_settings.graphql";

import { ConfigureWebhookEndpointForm } from "../ConfigureWebhookEndpointForm";
import ExperimentalWebhooksCallOut from "../ExperimentalWebhooksCallOut";

interface Props {
  settings: AddWebhookEndpointContainer_settings;
}

const AddWebhookEndpointContainer: FunctionComponent<Props> = ({
  settings,
}) => {
  const settingsData = useFragment(
    graphql`
      fragment AddWebhookEndpointContainer_settings on Settings {
        ...ConfigureWebhookEndpointForm_settings
      }
    `,
    settings
  );

  const { router } = useRouter();
  const onCancel = useCallback(() => {
    router.push(urls.admin.webhooks);
  }, [router]);

  return (
    <HorizontalGutter size="double">
      <ExperimentalWebhooksCallOut />
      <ConfigBox
        title={
          <Localized id="configure-webhooks-addEndpoint">
            <Header>Add a webhook endpoint</Header>
          </Localized>
        }
      >
        <ConfigureWebhookEndpointForm
          settings={settingsData}
          webhookEndpoint={null}
          onCancel={onCancel}
        />
      </ConfigBox>
    </HorizontalGutter>
  );
};

export default AddWebhookEndpointContainer;
