import { Localized } from "@fluent/react/compat";
import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";

import { useNotification } from "coral-admin/App/GlobalNotification";
import { graphql } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { AppNotification } from "coral-ui/components/v2";

import { AddSiteRouteQueryResponse } from "coral-admin/__generated__/AddSiteRouteQuery.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import CreateSiteForm from "./CreateSiteForm";

interface Props {
  data: AddSiteRouteQueryResponse | null;
}

const AddSiteRoute: FunctionComponent<Props> = props => {
  const { router } = useRouter();
  const { setMessage } = useNotification();
  const onSiteCreate = useCallback((id: string, name: string) => {
    router.replace(`/admin/configure/organization/sites/${id}`);
    if (props.data) {
      setMessage(
        <Localized
          id="configure-sites-add-success"
          $site={name}
          $org={props.data.settings.organization.name}
        >
          <AppNotification icon="check_circle_outline">
            {name} has been added to {props.data.settings.organization.name}
          </AppNotification>
        </Localized>,
        3000
      );
    }
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
