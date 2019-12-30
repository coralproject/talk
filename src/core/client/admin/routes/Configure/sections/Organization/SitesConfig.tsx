import { Localized } from "fluent-react/compat";
import { Link } from "found";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Button, FormFieldDescription } from "coral-ui/components/v2";

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
      <FormFieldDescription>
        A description of what sites are and why you might want more.
      </FormFieldDescription>
      <Link to="/admin/configure/organization/sites/new">Add a site</Link>
      <div>
        {sites.map(site => (
          <SiteRowContainer site={site} key={site.id} />
        ))}
      </div>
    </ConfigBox>
  );
};

export default SitesConfig;
