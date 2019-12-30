import { Link } from "found";
import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Divider, Flex } from "coral-ui/components/v2";

import { SiteRowContainer_site } from "coral-admin/__generated__/SiteRowContainer_site.graphql";

import styles from "./SiteRowContainer.css";

interface Props {
  site: SiteRowContainer_site;
}

const SiteRowContainer: FunctionComponent<Props> = ({ site }) => {
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <h3 className={styles.name}>{site.name}</h3>
        <Link to={`/admin/configure/organization/sites/${site.id}`}>
          Details
        </Link>
      </Flex>
      <Divider />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment SiteRowContainer_site on Site {
      id
      name
      createdAt
    }
  `,
})(SiteRowContainer);

export default enhanced;
