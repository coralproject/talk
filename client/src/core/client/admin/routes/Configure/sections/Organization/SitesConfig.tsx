import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { AddIcon, SvgIcon } from "coral-ui/components/icons";
import { Button, FormFieldDescription } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import SiteRowContainer from "./SiteRowContainer";
import SitesTable from "./SitesTable";

interface Props {
  sites: Array<{ id: string } & PropTypesOf<typeof SiteRowContainer>["site"]>;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const SitesConfig: FunctionComponent<Props> = ({
  sites,
  loading,
  disableLoadMore,
  onLoadMore,
  hasMore,
}) => {
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
      <Localized id="configure-organization-sites-explanation">
        <FormFieldDescription>
          Add a new site to your organization or edit an existing site's
          details.
        </FormFieldDescription>
      </Localized>
      <Localized
        id="configure-organization-sites-add-site"
        elems={{ icon: <SvgIcon size="xs" Icon={AddIcon} /> }}
      >
        <Button to="/admin/configure/organization/sites/new" iconLeft>
          <SvgIcon size="xs" Icon={AddIcon} />
          Add a site
        </Button>
      </Localized>
      <SitesTable
        sites={sites}
        loading={loading}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        disableLoadMore={disableLoadMore}
      />
    </ConfigBox>
  );
};

export default SitesConfig;
