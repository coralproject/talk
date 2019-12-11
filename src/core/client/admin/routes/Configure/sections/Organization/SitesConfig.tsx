import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import SiteRowContainer from "./SiteRowContainer";

interface Props {
  sites: Array<{ id: string } & PropTypesOf<typeof SiteRowContainer>["site"]>;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const SitesConfig: FunctionComponent<Props> = ({ sites }) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-organization-sites">
          <Header htmlFor="configure-organization-organization.sites">
            Sites
          </Header>
        </Localized>
      }
    >
      {sites.map(site => (
        <SiteRowContainer site={site} key={site.id} />
      ))}
    </ConfigBox>
  );
};

export default SitesConfig;
