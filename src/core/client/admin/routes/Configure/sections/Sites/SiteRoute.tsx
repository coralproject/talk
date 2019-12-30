import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { graphql } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";

import { SiteRouteQueryResponse } from "coral-admin/__generated__/SiteRouteQuery.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import EditSiteForm from "./EditSiteForm";

interface Props {
  data: SiteRouteQueryResponse;
}

const AddSiteRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data || !data.site) {
    return null;
  }
  const { site } = data;
  return (
    <ConfigBox
      title={
        <Localized id="configure-sites-site-edit" $site={site.name}>
          <Header>Edit {site.name} details</Header>
        </Localized>
      }
    >
      <EditSiteForm site={site} settings={data.settings} />
    </ConfigBox>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query SiteRouteQuery($siteID: ID!) {
      site(id: $siteID) {
        name
        ...EditSiteForm_site
      }
      settings {
        ...EditSiteForm_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(AddSiteRoute);

export default enhanced;
