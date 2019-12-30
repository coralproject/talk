import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";

import { graphql } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";

import { AddSiteRouteQueryResponse } from "coral-admin/__generated__/AddSiteRouteQuery.graphql";

import CreateSiteForm from "./CreateSiteForm";

interface Props {
  data: AddSiteRouteQueryResponse | null;
}

const AddSiteRoute: FunctionComponent<Props> = props => {
  const { router } = useRouter();
  const onSiteCreate = useCallback((id: string) => {
    router.replace(`/admin/sites/${id}`);
  }, []);
  return (
    <div>
      {props.data && (
        <h2>Add a new site to {props.data.settings.organization.name}</h2>
      )}
      <CreateSiteForm onCreate={onSiteCreate} />
    </div>
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
