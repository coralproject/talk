import { Link } from "found";
import React, { FunctionComponent } from "react";

import getEndpointLink from "coral-admin/helpers/getEndpointLink";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { TableCell, TableRow, TextLink } from "coral-ui/components/v2";

import { WebhookEndpointRow_webhookEndpoint } from "coral-admin/__generated__/WebhookEndpointRow_webhookEndpoint.graphql";

import EndpointStatusMarker from "./EndpointStatusMarker";

import styles from "./WebhookEndpointRow.css";

interface Props {
  endpoint: WebhookEndpointRow_webhookEndpoint;
}

const WebhookEndpointRow: FunctionComponent<Props> = ({ endpoint }) => (
  <TableRow>
    <TableCell>
      <Link
        to={getEndpointLink(endpoint.id)}
        as={TextLink}
        className={styles.urlButton}
      >
        {endpoint.url}
      </Link>
    </TableCell>
    <TableCell>
      <EndpointStatusMarker enabled={endpoint.enabled} />
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
