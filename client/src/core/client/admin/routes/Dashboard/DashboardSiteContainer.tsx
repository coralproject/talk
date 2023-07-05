import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { DropdownButton } from "coral-ui/components/v2";

import { DashboardSiteContainer_site } from "coral-admin/__generated__/DashboardSiteContainer_site.graphql";

import styles from "./DashboardSiteContainer.css";

interface Props {
  site: DashboardSiteContainer_site;
}

const DashboardSiteContainer: FunctionComponent<Props> = ({ site }) => {
  return (
    <DropdownButton
      className={styles.button}
      to={`/admin/dashboard/${site.id}`}
    >
      {site.name}
    </DropdownButton>
  );
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment DashboardSiteContainer_site on Site {
      id
      name
      createdAt
    }
  `,
})(DashboardSiteContainer);

export default enhanced;
