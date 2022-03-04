import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import getEndpointLink from "coral-admin/helpers/getEndpointLink";
import {
  Button,
  Flex,
  Icon,
  TableCell,
  TableRow,
} from "coral-ui/components/v2";

import { WebhookEndpointRow_webhookEndpoint$key as WebhookEndpointRow_webhookEndpoint } from "coral-admin/__generated__/WebhookEndpointRow_webhookEndpoint.graphql";

import StatusMarker from "./StatusMarker";

import styles from "./WebhookEndpointRow.css";

interface Props {
  endpoint: WebhookEndpointRow_webhookEndpoint;
}

const WebhookEndpointRow: FunctionComponent<Props> = ({ endpoint }) => {
  const endpointData = useFragment(
    graphql`
      fragment WebhookEndpointRow_webhookEndpoint on WebhookEndpoint {
        id
        enabled
        url
      }
    `,
    endpoint
  );

  return (
    <TableRow data-testid={`webhook-endpoint-${endpointData.id}`}>
      <TableCell className={styles.urlColumn}>{endpointData.url}</TableCell>
      <TableCell>
        <StatusMarker enabled={endpointData.enabled} />
      </TableCell>
      <TableCell>
        <Flex justifyContent="flex-end">
          <Localized
            id="configure-webhooks-detailsButton"
            icon={<Icon>keyboard_arrow_right</Icon>}
          >
            <Button
              variant="text"
              to={getEndpointLink(endpointData.id)}
              iconRight
            >
              Details
              <Icon>keyboard_arrow_right</Icon>
            </Button>
          </Localized>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

export default WebhookEndpointRow;
