import { Match, Router, withRouter } from "found";
import React, { FunctionComponent, useCallback, useState } from "react";

import Subheader from "coral-admin/routes/Configure/Subheader";
import { urls } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import {
  Button,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";

import { EndpointDangerZone_webhookEndpoint } from "coral-admin/__generated__/EndpointDangerZone_webhookEndpoint.graphql";

import DeleteWebhookEndpointMutation from "./DeleteWebhookEndpointMutation";
import DisableWebhookEndpointMutation from "./DisableWebhookEndpointMutation";
import EnableWebhookEndpointMutation from "./EnableWebhookEndpointMutation";
import RollSigningSecretModal from "./RollSigningSecretModal";

interface Props {
  webhookEndpoint: EndpointDangerZone_webhookEndpoint;
  router: Router;
  match: Match;
}

const EndpointDangerZone: FunctionComponent<Props> = ({
  webhookEndpoint,
  router,
}) => {
  const { localeBundles } = useCoralContext();
  const enableWebhookEndpoint = useMutation(EnableWebhookEndpointMutation);
  const disableWebhookEndpoint = useMutation(DisableWebhookEndpointMutation);
  const deleteWebhookEndpoint = useMutation(DeleteWebhookEndpointMutation);

  const [rollSecretOpen, setRollSecretOpen] = useState<boolean>(false);
  const onRollSecret = useCallback(async () => {
    setRollSecretOpen(true);
  }, []);
  const onHideRollSecret = useCallback(async () => {
    setRollSecretOpen(false);
  }, [setRollSecretOpen]);

  const onEnable = useCallback(async () => {
    const message = getMessage(
      localeBundles,
      "configure-webhookEndpointsConfigure-confirmEnable",
      "Enabling the webhook endpoint will start to send events to this URL. Are you sure you want to continue?"
    );

    if (window.confirm(message)) {
      await enableWebhookEndpoint({ id: webhookEndpoint.id });
    }
  }, [webhookEndpoint, enableWebhookEndpoint]);
  const onDisable = useCallback(async () => {
    const message = getMessage(
      localeBundles,
      "configure-webhookEndpointsConfigure-confirmDisable",
      "Disabling this webhook endpoint will stop any new events from being sent to this URL. Are you sure you want to continue?"
    );

    if (window.confirm(message)) {
      await disableWebhookEndpoint({ id: webhookEndpoint.id });
    }
  }, [webhookEndpoint, disableWebhookEndpoint]);

  const onDelete = useCallback(async () => {
    const message = getMessage(
      localeBundles,
      "configure-webhookEndpointsConfigure-confirmDelete",
      "Deleting this webhook endpoint will stop any new events from being sent to this URL, and remove all the associated settings with this webhook endpoint. Are you sure you want to continue?"
    );

    if (window.confirm(message)) {
      await deleteWebhookEndpoint({ id: webhookEndpoint.id });

      // Send the user back to the webhook endpoints listing.
      router.push(urls.admin.webhooks);
    }
  }, [webhookEndpoint, disableWebhookEndpoint, router]);

  return (
    <>
      <Subheader>Danger Zone</Subheader>
      <FormField>
        <Label>Roll signing secret</Label>
        <FormFieldDescription>
          You can roll this secret if the key and the previous key will also be
          used to sign payloads for up to 24 hours.
        </FormFieldDescription>
        <Button color="alert" onClick={onRollSecret}>
          Roll secret
        </Button>
      </FormField>
      <RollSigningSecretModal
        endpointID={webhookEndpoint.id}
        onHide={onHideRollSecret}
        open={rollSecretOpen}
      />
      {webhookEndpoint.enabled ? (
        <FormField>
          <Label>Disable endpoint</Label>
          <FormFieldDescription>
            This endpoint is current enabled. By disabling this endpoint no new
            events will be sent to the URL provided.
          </FormFieldDescription>
          <Button color="alert" onClick={onDisable}>
            Disable endpoint
          </Button>
        </FormField>
      ) : (
        <FormField>
          <Label>Enable endpoint</Label>
          <FormFieldDescription>
            This endpoint is current disabled. By enabling this endpoint new
            events will be sent to the URL provided.
          </FormFieldDescription>
          <Button color="regular" onClick={onEnable}>
            Enable endpoint
          </Button>
        </FormField>
      )}
      <FormField>
        <Label>Delete endpoint</Label>
        <FormFieldDescription>
          Deleting the endpoint will prevent any new events from being sent to
          the URL provided.
        </FormFieldDescription>
        <Button color="alert" onClick={onDelete}>
          Delete endpoint
        </Button>
      </FormField>
    </>
  );
};

const enhanced = withRouter(
  withFragmentContainer<Props>({
    webhookEndpoint: graphql`
      fragment EndpointDangerZone_webhookEndpoint on WebhookEndpoint {
        id
        enabled
      }
    `,
  })(EndpointDangerZone)
);

export default enhanced;
