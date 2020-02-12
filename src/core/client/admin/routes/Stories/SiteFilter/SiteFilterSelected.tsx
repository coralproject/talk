import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { SiteFilterSelected_site } from "coral-admin/__generated__/SiteFilterSelected_site.graphql";

import styles from "./SiteFilterSelected.css";

interface Props {
  site: SiteFilterSelected_site;
}

const SiteFilterSelected: FunctionComponent<Props> = ({ site }) => {
  return <span className={styles.root}>{site.name}</span>;
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment SiteFilterSelected_site on Site {
      name
    }
  `,
})(SiteFilterSelected);

export default enhanced;
