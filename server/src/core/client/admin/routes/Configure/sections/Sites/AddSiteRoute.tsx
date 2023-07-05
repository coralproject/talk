import { Localized } from "@fluent/react/compat";
import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useNotification } from "coral-admin/App/GlobalNotification";
import { withRouteConfig } from "coral-framework/lib/router";
import { AppNotification } from "coral-ui/components/v2";

import { AddSiteRouteQueryResponse } from "coral-admin/__generated__/AddSiteRouteQuery.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import CreateSiteForm from "./CreateSiteForm";

interface Props {
  data: AddSiteRouteQueryResponse | null;
}

const AddSiteRoute: FunctionComponent<Props> = (props) => {
  const { router } = useRouter();
  const { setMessage, clearMessage } = useNotification();
  const onSiteCreate = useCallback(
    (id: string, name: string) => {
      router.replace(`/admin/configure/organization/sites/${id}`);
      setMessage(
        <Localized
          id="configure-sites-add-success"
          vars={{
            site: name,
            org: (props.data && props.data.settings.organization.name) ?? "",
          }}
        >
          <AppNotification icon="check_circle_outline" onClose={clearMessage}>
            {name} has been added to{" "}
            {props.data && props.data.settings.organization.name}
          </AppNotification>
        </Localized>
      );
    },
    [props.data]
  );
  if (!props.data) {
    return null;
  }
  return (
    <ConfigBox
      title={
        <Localized
          id="configure-sites-add-new-site"
          vars={{ site: props.data.settings.organization.name }}
        >
          <Header>
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
