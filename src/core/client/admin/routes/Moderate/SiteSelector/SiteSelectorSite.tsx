import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Option } from "coral-ui/components/v2";

import { SiteSelectorSite_site } from "coral-admin/__generated__/SiteSelectorSite_site.graphql";

interface Props {
  site: SiteSelectorSite_site;
}

const SiteSelectorSite: FunctionComponent<Props> = ({ site }) => {
  return <Option value={site.id}>{site.name}</Option>;
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment SiteSelectorSite_site on Site {
      name
      id
    }
  `,
})(SiteSelectorSite);

export default enhanced;
