import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";

import { graphql } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";

import { AddSiteRouteQueryResponse } from "coral-admin/__generated__/AddSiteRouteQuery.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import CreateSiteForm from "./CreateSiteForm";
import { Localized } from "@fluent/react/compat";

interface Props {
  data: AddSiteRouteQueryResponse | null;
}

const AddSiteRoute: FunctionComponent<Props> = props => {
  const { router } = useRouter();
  const onSiteCreate = useCallback((id: string) => {
    router.replace(`/admin/sites/${id}`);
  }, []);
  if (!props.data) {
    return null;
  }
  return (
    <ConfigBox
      title={
        <Localized
          id="configure-sites-add-new-site"
          $site={props.data.settings.organization.name}
        >
          <Header>
            {" "}
            Add a new site to {props.data.settings.organization.name}
          </Header>
        </Localized>
      }
    >
      <CreateSiteForm onCreate={onSiteCreate} />
    </ConfigBox>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query AddSiteRouteQuery {
      settings {
        organization {
          name
        }
      }
    }
  `,
  cacheConfig: { force: true },
})(AddSiteRoute);

export default enhanced;
