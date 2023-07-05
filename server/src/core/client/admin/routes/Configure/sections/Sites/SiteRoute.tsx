import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useNotification } from "coral-admin/App/GlobalNotification";
import { withRouteConfig } from "coral-framework/lib/router";
import { AppNotification } from "coral-ui/components/v2";

import { SiteRouteQueryResponse } from "coral-admin/__generated__/SiteRouteQuery.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import EditSiteForm from "./EditSiteForm";

interface Props {
  data: SiteRouteQueryResponse;
}

const AddSiteRoute: FunctionComponent<Props> = ({ data }) => {
  const { setMessage, clearMessage } = useNotification();
  const onSiteEdit = useCallback(
    (name: string) => {
      setMessage(
        <Localized id="configure-sites-edit-success" vars={{ site: name }}>
          <AppNotification icon="check_circle_outline" onClose={clearMessage}>
            Changes to {name} have been saved
          </AppNotification>
        </Localized>
      );
    },
    [setMessage, clearMessage]
  );
  if (!data || !data.site) {
    return null;
  }
  const { site } = data;
  return (
    <ConfigBox
      title={
        <Localized id="configure-sites-site-edit" vars={{ site: site.name }}>
          <Header>Edit {site.name} details</Header>
        </Localized>
      }
    >
      <EditSiteForm
        onEditSuccess={onSiteEdit}
        site={site}
        settings={data.settings}
      />
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
