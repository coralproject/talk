import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { DropdownButton } from "coral-ui/components/v2";

import { DashboardSiteContainer_site$key as DashboardSiteContainer_site } from "coral-admin/__generated__/DashboardSiteContainer_site.graphql";

import styles from "./DashboardSiteContainer.css";

interface Props {
  site: DashboardSiteContainer_site;
}

const DashboardSiteContainer: FunctionComponent<Props> = ({ site }) => {
  const siteData = useFragment(
    graphql`
      fragment DashboardSiteContainer_site on Site {
        id
        name
        createdAt
      }
    `,
    site
  );

  return (
    <DropdownButton
      className={styles.button}
      to={`/admin/dashboard/${siteData.id}`}
    >
      {siteData.name}
    </DropdownButton>
  );
};

export default DashboardSiteContainer;
