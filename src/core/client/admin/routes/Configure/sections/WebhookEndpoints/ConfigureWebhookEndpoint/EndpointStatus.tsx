import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import Subheader from "coral-admin/routes/Configure/Subheader";
import { CopyButton } from "coral-framework/components";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import {
  Flex,
  FormField,
  FormFieldDescription,
  HelperText,
  Label,
  PasswordField,
} from "coral-ui/components/v2";

import { EndpointStatus_webhookEndpoint } from "coral-admin/__generated__/EndpointStatus_webhookEndpoint.graphql";

import StatusMarker from "../StatusMarker";

interface Props {
  webhookEndpoint: EndpointStatus_webhookEndpoint;
}

const EndpointStatus: FunctionComponent<Props> = ({ webhookEndpoint }) => {
  return (
    <>
      <Localized id="configure-webhooks-endpointStatus">
        <Subheader>Endpoint status</Subheader>
      </Localized>
      <FormField>
        <Localized id="configure-webhooks-status">
          <Label>Status</Label>
        </Localized>
        <StatusMarker enabled={webhookEndpoint.enabled} />
      </FormField>
      <FormField>
        <Localized id="configure-webhooks-signingSecret">
          <Label>Signing secret</Label>
        </Localized>
        <Localized
          id="configure-webhooks-signingSecretDescription"
          externalLink={
            <ExternalLink href="https://docs.coralproject.net/coral/v5/integrating/webhooks/#signing" />
          }
        >
          <FormFieldDescription>
            The following signing secret is used to sign request payloads sent
            to the URL. To learn more about webhook signing, visit our{" "}
            <ExternalLink href="https://docs.coralproject.net/coral/v5/integrating/webhooks/#signing">
              Webhook Guide
            </ExternalLink>
            .
          </FormFieldDescription>
        </Localized>
        <Flex direction="row" itemGutter="half" alignItems="center">
          <PasswordField
            value={webhookEndpoint.signingSecret.secret}
            fullWidth
            readOnly
          />
          <CopyButton text={webhookEndpoint.signingSecret.secret} />
        </Flex>
        <HelperText>
          KEY GENERATED AT: {webhookEndpoint.signingSecret.createdAt}
        </HelperText>
      </FormField>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  webhookEndpoint: graphql`
    fragment EndpointStatus_webhookEndpoint on WebhookEndpoint {
      id
      enabled
      signingSecret {
        secret
        createdAt
      }
    }
  `,
})(EndpointStatus);

export default enhanced;
