import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import Subheader from "coral-admin/routes/Configure/Subheader";
import { CopyButton } from "coral-framework/components";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  Flex,
  FormField,
  FormFieldDescription,
  HelperText,
  Label,
  PasswordField,
} from "coral-ui/components/v2";

import { EndpointStatus_webhookEndpoint$key as EndpointStatus_webhookEndpoint } from "coral-admin/__generated__/EndpointStatus_webhookEndpoint.graphql";

import StatusMarker from "../StatusMarker";

interface Props {
  webhookEndpoint: EndpointStatus_webhookEndpoint;
}

const EndpointStatus: FunctionComponent<Props> = ({ webhookEndpoint }) => {
  const webhookEndpointData = useFragment(
    graphql`
      fragment EndpointStatus_webhookEndpoint on WebhookEndpoint {
        id
        enabled
        signingSecret {
          secret
          createdAt
        }
      }
    `,
    webhookEndpoint
  );

  return (
    <>
      <Localized id="configure-webhooks-endpointStatus">
        <Subheader>Endpoint status</Subheader>
      </Localized>
      <FormField>
        <Localized id="configure-webhooks-status">
          <Label>Status</Label>
        </Localized>
        <StatusMarker enabled={webhookEndpointData.enabled} />
      </FormField>
      <FormField>
        <Localized id="configure-webhooks-signingSecret">
          <Label>Signing secret</Label>
        </Localized>
        <Localized
          id="configure-webhooks-signingSecretDescription"
          externalLink={
            <ExternalLink href="https://github.com/coralproject/talk/blob/main/WEBHOOKS.md#webhook-signing" />
          }
        >
          <FormFieldDescription>
            The following signing secret is used to sign request payloads sent
            to the URL. To learn more about webhook signing, visit our{" "}
            <ExternalLink href="https://github.com/coralproject/talk/blob/main/WEBHOOKS.md#webhook-signing">
              Webhook Guide
            </ExternalLink>
            .
          </FormFieldDescription>
        </Localized>
        <Flex direction="row" itemGutter="half" alignItems="center">
          <PasswordField
            value={webhookEndpointData.signingSecret.secret}
            fullWidth
            readOnly
          />
          <CopyButton text={webhookEndpointData.signingSecret.secret} />
        </Flex>
        <Localized
          id="configure-webhooks-generatedAt"
          $date={new Date(webhookEndpointData.signingSecret.createdAt)}
        >
          <HelperText>
            KEY GENERATED AT: {webhookEndpointData.signingSecret.createdAt}
          </HelperText>
        </Localized>
      </FormField>
    </>
  );
};

export default EndpointStatus;
