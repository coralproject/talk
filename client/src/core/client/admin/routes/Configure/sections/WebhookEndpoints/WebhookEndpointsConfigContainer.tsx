import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { urls } from "coral-framework/helpers";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  FormFieldDescription,
  HorizontalGutter,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import { WebhookEndpointsConfigContainer_settings } from "coral-admin/__generated__/WebhookEndpointsConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import Subheader from "../../Subheader";
import ExperimentalWebhooksCallOut from "./ExperimentalWebhooksCallOut";
import WebhookEndpointRow from "./WebhookEndpointRow";

interface Props {
  settings: WebhookEndpointsConfigContainer_settings;
}

const WebhookEndpointsConfigContainer: FunctionComponent<Props> = ({
  settings,
}) => {
  return (
    <HorizontalGutter size="double" data-testid="webhooks-container">
      <ExperimentalWebhooksCallOut />
      <ConfigBox
        title={
          <Localized id="configure-webhooks-header-title">
            <Header htmlFor="configure-webhooks-header.title">Webhooks</Header>
          </Localized>
        }
      >
        <Localized
          id="configure-webhooks-description"
          elems={{
            externalLink: (
              <ExternalLink href="https://github.com/coralproject/talk/blob/main/WEBHOOKS.md" />
            ),
          }}
        >
          <FormFieldDescription>
            Configure an endpoint to send events to when events occur within
            Coral. These events will be JSON encoded and signed. To learn more
            about webhook signing, visit our{" "}
            <ExternalLink href="https://github.com/coralproject/talk/blob/main/WEBHOOKS.md">
              our docs
            </ExternalLink>
            .
          </FormFieldDescription>
        </Localized>
        <Button
          to={urls.admin.addWebhookEndpoint}
          iconLeft
          data-testid="add-webhook-endpoint"
        >
          <Icon size="md">add</Icon>
          <Localized id="configure-webhooks-addEndpointButton">
            Add webhook endpoint
          </Localized>
        </Button>
        <Localized id="configure-webhooks-endpoints">
          <Subheader>Endpoints</Subheader>
        </Localized>
        {settings.webhooks.endpoints.length > 0 ? (
          <Table fullWidth>
            <TableHead>
              <TableRow>
                <Localized id="configure-webhooks-url">
                  <TableCell>URL</TableCell>
                </Localized>
                <Localized id="configure-webhooks-status">
                  <TableCell>Status</TableCell>
                </Localized>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {settings.webhooks.endpoints.map((endpoint, idx) => (
                <WebhookEndpointRow key={idx} endpoint={endpoint} />
              ))}
            </TableBody>
          </Table>
        ) : (
          <Localized id="configure-webhooks-noEndpoints">
            <CallOut color="regular" fullWidth>
              There are no webhook endpoints configured, add one above.
            </CallOut>
          </Localized>
        )}
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment WebhookEndpointsConfigContainer_settings on Settings {
      webhooks {
        endpoints {
          ...WebhookEndpointRow_webhookEndpoint
        }
      }
    }
  `,
})(WebhookEndpointsConfigContainer);

export default enhanced;
