import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { SiteRowContainer_site } from "coral-admin/__generated__/SiteRowContainer_site.graphql";

interface Props {
  site: SiteRowContainer_site;
}

const SiteRowContainer: FunctionComponent<Props> = ({ site }) => {
  return (
    <div>
      <h2>{site.name}</h2>
    </div>
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
