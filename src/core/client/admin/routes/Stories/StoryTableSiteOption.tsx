import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Option } from "coral-ui/components/v2";

import { StoryTableSiteOption_site } from "coral-admin/__generated__/StoryTableSiteOption_site.graphql";

interface Props {
  site: StoryTableSiteOption_site;
}

const StoryTableSiteOption: FunctionComponent<Props> = ({ site }) => {
  return <Option value={site.id}>{site.name}</Option>;
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment StoryTableSiteOption_site on Site {
      name
      id
    }
  `,
})(StoryTableSiteOption);

export default enhanced;
