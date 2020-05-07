import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Button, Flex } from "coral-ui/components/v2";
import { TableCell, TableRow } from "coral-ui/components/v2/Table";

import { DashboardLinkSite_site } from "coral-admin/__generated__/DashboardLinkSite_site.graphql";

interface Props {
  site: DashboardLinkSite_site;
}

const DashboardLinkSite: FunctionComponent<Props> = ({ site }) => {
  return (
    <TableRow>
      <TableCell>
        <Flex>
          <Button variant="text" to={`/admin/dashboard/${site.id}`} iconRight>
            {site.name}
          </Button>
        </Flex>
      </TableCell>
    </TableRow>
  );
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment DashboardLinkSite_site on Site {
      id
      name
      createdAt
    }
  `,
})(DashboardLinkSite);

export default enhanced;
