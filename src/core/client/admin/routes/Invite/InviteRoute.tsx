import React, { useCallback, useState } from "react";
import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { useToken } from "coral-framework/hooks";
import { createFetch } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { parseHashQuery } from "coral-framework/utils";
import { Delay, Flex, Spinner } from "coral-ui/components/v2";

import { InviteRouteQueryResponse } from "coral-admin/__generated__/InviteRouteQuery.graphql";

import InviteCompleteFormContainer from "./InviteCompleteFormContainer";
import InviteLayout from "./InviteLayout";
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
  const [tokenState, tokenError] = useToken(fetcher, token);

  if (!data || tokenState === "UNCHECKED") {
    return (
      <Flex
        margin={8}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Delay>
          <Spinner />
        </Delay>
      </Flex>
    );
  }

  if (tokenState !== "VALID" || tokenError) {
    return (
      <InviteLayout>
        <Sorry reason={tokenError} />
      </InviteLayout>
    );
  }

  return (
    <InviteLayout>
      {!finished ? (
        <InviteCompleteFormContainer
          token={token!}
          onSuccess={onSuccess}
          settings={data.settings}
        />
      ) : (
        <SuccessContainer token={token!} settings={data.settings} />
      )}
    </InviteLayout>
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
  render: function InviteRouteRender({ match, Component, ...rest }) {
    return (
      <Component
        token={parseHashQuery(match.location.hash).inviteToken}
        {...rest}
      />
    );
  },
})(InviteRoute);

export default enhanced;
