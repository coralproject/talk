import React, { useCallback, useState } from "react";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { InviteRouteQueryResponse } from "coral-account/__generated__/InviteRouteQuery.graphql";
import TokenChecker from "coral-account/helpers/TokenChecker";
import { createFetch } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { parseHashQuery } from "coral-framework/utils";
import { Delay, Flex, Spinner } from "coral-ui/components";

import InviteCompleteFormContainer from "./InviteCompleteFormContainer";
import Sorry from "./Sorry";
import SuccessContainer from "./SuccessContainer";

const fetcher = createFetch(
  "inviteToken",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/account/invite", {
      method: "GET",
      token: variables.token,
    })
);

interface Props {
  data: InviteRouteQueryResponse | null;
  token: string | undefined;
}

const InviteRoute: React.FunctionComponent<Props> = ({ token, data }) => {
  const [finished, setFinished] = useState(false);
  const onSuccess = useCallback(() => {
    setFinished(true);
  }, []);

  if (!data) {
    return (
      <Flex justifyContent="center">
        <Delay>
          <Spinner />
        </Delay>
      </Flex>
    );
  }

  return (
    <TokenChecker token={token} fetcher={fetcher}>
      {({ err }) =>
        err ? (
          <Sorry reason={err} />
        ) : !finished ? (
          <InviteCompleteFormContainer
            token={token!}
            onSuccess={onSuccess}
            settings={data.settings}
          />
        ) : (
          <SuccessContainer token={token!} settings={data.settings} />
        )
      }
    </TokenChecker>
  );
};

const enhanced = withRouteConfig<Props>({
  query: graphql`
    query InviteRouteQuery {
      settings {
        ...InviteCompleteFormContainer_settings
        ...SuccessContainer_settings
      }
    }
  `,
  render: ({ match, Component, ...rest }) => (
    <Component
      token={parseHashQuery(match.location.hash).inviteToken}
      {...rest}
    />
  ),
})(InviteRoute);

export default enhanced;
