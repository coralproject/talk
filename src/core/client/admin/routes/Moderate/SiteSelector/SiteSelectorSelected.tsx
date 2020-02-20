import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { SiteSelectorSelected_site } from "coral-admin/__generated__/SiteSelectorSelected_site.graphql";

import styles from "./SiteSelectorSelected.css";

interface Props {
  site: SiteSelectorSelected_site;
}

const SiteSelectorSelected: FunctionComponent<Props> = ({ site }) => {
  return <span className={styles.root}>{site.name}</span>;
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment SiteSelectorSelected_site on Site {
      name
      id
    }
  `,
})(SiteSelectorSelected);

export default enhanced;
