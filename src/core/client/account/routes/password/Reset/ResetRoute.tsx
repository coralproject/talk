import React, { useCallback, useState } from "react";
import { Environment } from "relay-runtime";

import TokenChecker from "coral-account/helpers/TokenChecker";
import { createFetch } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { parseHashQuery } from "coral-framework/utils";

import ResetPasswordForm from "./ResetPasswordForm";
import Sorry from "./Sorry";
import Success from "./Success";

const fetcher = createFetch(
  "resetToken",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/auth/local/forgot", {
      method: "GET",
      token: variables.token,
    })
);

interface Props {
  token: string | undefined;
}

const ResetRoute: React.FunctionComponent<Props> = ({ token }) => {
  const [finished, setFinished] = useState(false);
  const onSuccess = useCallback(() => {
    setFinished(true);
  }, []);
  return (
    <TokenChecker token={token} fetcher={fetcher}>
      {({ err }) =>
        err ? (
          <Sorry reason={err} />
        ) : !finished ? (
          <ResetPasswordForm token={token!} onSuccess={onSuccess} />
        ) : (
          <Success />
        )
      }
    </TokenChecker>
  );
};

const enhanced = withRouteConfig<Props>({
  render: ({ match, Component }) => (
    <Component token={parseHashQuery(match.location.hash).resetToken} />
  ),
})(ResetRoute);

export default enhanced;
