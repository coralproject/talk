import { FormApi } from "final-form";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withRouteConfig } from "coral-framework/lib/router";
import { Delay, Spinner } from "coral-ui/components/v2";

import { SlackConfigRouteQueryResponse } from "coral-admin/__generated__/SlackConfigRouteQuery.graphql";

import SlackConfigSubFormContainer from "./SlackConfigSubFormContainer";

interface Props {
  data: SlackConfigRouteQueryResponse | null;
  form: FormApi;
  submitting: boolean;
}

const SlackConfigRoute: FunctionComponent<Props> = ({
  data,
  form,
  submitting,
}) => {
  if (!data) {
    return (
      <Delay>
        <Spinner />
      </Delay>
    );
  }

  return (
    <SlackConfigSubFormContainer
      submitting={submitting}
      settings={data.settings}
    />
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query SlackConfigRouteQuery {
      settings {
        ...SlackConfigSubFormContainer_settings
      }
    }
  `,
  cacheConfig: { force: true },
})(SlackConfigRoute);

export default enhanced;
