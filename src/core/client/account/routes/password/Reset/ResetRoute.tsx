import React, { useCallback, useState } from "react";
import { Environment } from "relay-runtime";

import Loading from "coral-account/components/Loading";
import { useToken } from "coral-framework/hooks";
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
  const [state, error] = useToken(fetcher, token);

  if (state === "UNCHECKED") {
    return <Loading />;
  }

  if (state !== "VALID" || error) {
    return <Sorry reason={error} />;
  }

  return !finished ? (
    <ResetPasswordForm token={token!} onSuccess={onSuccess} />
  ) : (
    <Success />
  );
};

const enhanced = withRouteConfig<Props>({
  render: ({ match, Component }) => (
    <Component token={parseHashQuery(match.location.hash).resetToken} />
  ),
})(ResetRoute);

export default enhanced;
