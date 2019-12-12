import React, { FunctionComponent } from "react";

import { graphql } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";

import { SiteRouteQueryResponse } from "coral-admin/__generated__/SiteRouteQuery.graphql";

import EmbedCode from "../Configure/sections/Advanced/EmbedCode";
import SiteForm from "./SiteForm";

interface Props {
  data: SiteRouteQueryResponse;
}

const AddSiteRoute: FunctionComponent<Props> = ({ data }) => {
  if (!data || !data.site) {
    return null;
  }
  const { site } = data;
  return (
    <div>
      <SiteForm site={site} />
      <EmbedCode siteID={site.id} staticURI={data.settings.staticURI} />
    </div>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query SiteRouteQuery($siteID: ID!) {
      site(id: $siteID) {
        id
        ...SiteForm_site
      }
      settings {
        staticURI
      }
    }
  `,
  cacheConfig: { force: true },
})(AddSiteRoute);

export default enhanced;
