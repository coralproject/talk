import { Localized } from "@fluent/react/compat";
import { useRouter } from "found";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql, useFragment } from "react-relay";

import Subheader from "coral-admin/routes/Configure/Subheader";
import { urls } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";

import { EndpointDangerZone_webhookEndpoint$key as EndpointDangerZone_webhookEndpoint } from "coral-admin/__generated__/EndpointDangerZone_webhookEndpoint.graphql";

import DeleteWebhookEndpointMutation from "./DeleteWebhookEndpointMutation";
import DisableWebhookEndpointMutation from "./DisableWebhookEndpointMutation";
import EnableWebhookEndpointMutation from "./EnableWebhookEndpointMutation";
import RotateSigningSecretModal from "./RotateSigningSecretModal";

interface Props {
  webhookEndpoint: EndpointDangerZone_webhookEndpoint;
}

const EndpointDangerZone: FunctionComponent<Props> = ({ webhookEndpoint }) => {
  const webhookEndpointData = useFragment(
    graphql`
      fragment EndpointDangerZone_webhookEndpoint on WebhookEndpoint {
        id
        enabled
      }
    `,
    webhookEndpoint
  );

  const { localeBundles } = useCoralContext();
  const { router } = useRouter();
  const enableWebhookEndpoint = useMutation(EnableWebhookEndpointMutation);
  const disableWebhookEndpoint = useMutation(DisableWebhookEndpointMutation);
  const deleteWebhookEndpoint = useMutation(DeleteWebhookEndpointMutation);

  const [rotateSecretOpen, setRotateSecretOpen] = useState<boolean>(false);
  const onRotateSecret = useCallback(async () => {
    setRotateSecretOpen(true);
  }, []);
  const onHideRotateSecret = useCallback(async () => {
    setRotateSecretOpen(false);
  }, [setRotateSecretOpen]);

  const onEnable = useCallback(async () => {
    const message = getMessage(
      localeBundles,
      "configure-webhooks-confirmEnable",
      "Enabling the webhook endpoint will start to send events to this URL. Are you sure you want to continue?"
    );

    // eslint-disable-next-line no-restricted-globals
    if (window.confirm(message)) {
      await enableWebhookEndpoint({ id: webhookEndpointData.id });
    }
  }, [localeBundles, enableWebhookEndpoint, webhookEndpointData.id]);
  const onDisable = useCallback(async () => {
    const message = getMessage(
      localeBundles,
      "configure-webhooks-confirmDisable",
      "Disabling this webhook endpoint will stop any new events from being sent to this URL. Are you sure you want to continue?"
    );

    // eslint-disable-next-line no-restricted-globals
    if (window.confirm(message)) {
      await disableWebhookEndpoint({ id: webhookEndpointData.id });
    }
  }, [localeBundles, disableWebhookEndpoint, webhookEndpointData.id]);

  const onDelete = useCallback(async () => {
    const message = getMessage(
      localeBundles,
      "configure-webhooks-confirmDelete",
      "Deleting this webhook endpoint will stop any new events from being sent to this URL, and remove all the associated settings with this webhook endpoint. Are you sure you want to continue?"
    );

    // eslint-disable-next-line no-restricted-globals
    if (window.confirm(message)) {
      await deleteWebhookEndpoint({ id: webhookEndpointData.id });

      // Send the user back to the webhook endpoints listing.
      router.push(urls.admin.webhooks);
    }
  }, [localeBundles, deleteWebhookEndpoint, webhookEndpointData.id, router]);

  return (
    <>
      <Localized id="configure-webhooks-dangerZone">
        <Subheader>Danger Zone</Subheader>
      </Localized>
      <FormField>
        <Localized id="configure-webhooks-rotateSigningSecret">
          <Label>Rotate signing secret</Label>
        </Localized>
        <Localized id="configure-webhooks-rotateSigningSecretDescription">
          <FormFieldDescription>
            Rotating the signing secret will allow to you to safely replace a
            signing secret used in production with a delay.
          </FormFieldDescription>
        </Localized>
        <Localized id="configure-webhooks-rotateSigningSecretButton">
          <Button color="alert" onClick={onRotateSecret}>
            Rotate signing secret
          </Button>
        </Localized>
      </FormField>
      <RotateSigningSecretModal
        endpointID={webhookEndpointData.id}
        onHide={onHideRotateSecret}
        open={rotateSecretOpen}
      />
      {webhookEndpointData.enabled ? (
        <FormField>
          <Localized id="configure-webhooks-disableEndpoint">
            <Label>Disable endpoint</Label>
          </Localized>
          <Localized id="configure-webhooks-disableEndpointDescription">
            <FormFieldDescription>
              This endpoint is current enabled. By disabling this endpoint no
              new events will be sent to the URL provided.
            </FormFieldDescription>
          </Localized>
          <Localized id="configure-webhooks-disableEndpointButton">
            <Button color="alert" onClick={onDisable}>
              Disable endpoint
            </Button>
          </Localized>
        </FormField>
      ) : (
        <FormField>
          <Localized id="configure-webhooks-enableEndpoint">
            <Label>Enable endpoint</Label>
          </Localized>
          <Localized id="configure-webhooks-enableEndpointDescription">
            <FormFieldDescription>
              This endpoint is current disabled. By enabling this endpoint new
              events will be sent to the URL provided.
            </FormFieldDescription>
          </Localized>
          <Localized id="configure-webhooks-enableEndpointButton">
            <Button color="regular" onClick={onEnable}>
              Enable endpoint
            </Button>
          </Localized>
        </FormField>
      )}
      <FormField>
        <Localized id="configure-webhooks-deleteEndpoint">
          <Label>Delete endpoint</Label>
        </Localized>
        <Localized id="configure-webhooks-deleteEndpointDescription">
          <FormFieldDescription>
            Deleting the endpoint will prevent any new events from being sent to
            the URL provided.
          </FormFieldDescription>
        </Localized>
        <Localized id="configure-webhooks-deleteEndpointButton">
          <Button color="alert" onClick={onDelete}>
            Delete endpoint
          </Button>
        </Localized>
      </FormField>
    </>
  );
};

export default EndpointDangerZone;
