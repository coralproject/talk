import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import getEndpointLink from "coral-admin/helpers/getEndpointLink";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ArrowRightIcon, SvgIcon } from "coral-ui/components/icons";
import { Button, Flex, TableCell, TableRow } from "coral-ui/components/v2";

import { WebhookEndpointRow_webhookEndpoint } from "coral-admin/__generated__/WebhookEndpointRow_webhookEndpoint.graphql";

import StatusMarker from "./StatusMarker";

import styles from "./WebhookEndpointRow.css";

interface Props {
  endpoint: WebhookEndpointRow_webhookEndpoint;
}

const WebhookEndpointRow: FunctionComponent<Props> = ({ endpoint }) => (
  <TableRow data-testid={`webhook-endpoint-${endpoint.id}`}>
    <TableCell className={styles.urlColumn}>{endpoint.url}</TableCell>
    <TableCell>
      <StatusMarker enabled={endpoint.enabled} />
    </TableCell>
    <TableCell>
      <Flex justifyContent="flex-end">
        <Localized
          id="configure-webhooks-detailsButton"
          elems={{
            icon: (
              <SvgIcon
                Icon={ArrowRightIcon}
                size="xxs"
                className={styles.detailsIcon}
              />
            ),
          }}
        >
          <Button variant="text" to={getEndpointLink(endpoint.id)} iconRight>
            Details
            <SvgIcon
              Icon={ArrowRightIcon}
              size="xxs"
              className={styles.detailsIcon}
            />
          </Button>
        </Localized>
      </Flex>
    </TableCell>
  </TableRow>
);

const enhanced = withFragmentContainer<Props>({
  endpoint: graphql`
    fragment WebhookEndpointRow_webhookEndpoint on WebhookEndpoint {
      id
      enabled
      url
    }
  `,
})(WebhookEndpointRow);

export default enhanced;
