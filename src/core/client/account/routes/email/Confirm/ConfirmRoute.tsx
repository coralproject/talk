import React, { useCallback, useState } from "react";
import { Environment } from "relay-runtime";

import TokenChecker from "coral-account/helpers/TokenChecker";
import { createFetch } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { parseHashQuery } from "coral-framework/utils";

import ConfirmForm from "./ConfirmForm";
import Sorry from "./Sorry";
import Success from "./Success";

const fetcher = createFetch(
  "confirmToken",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/account/confirm", {
      method: "GET",
      token: variables.token,
    })
);

interface Props {
  token: string | undefined;
}

const ConfirmRoute: React.FunctionComponent<Props> = ({ token }) => {
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
          <ConfirmForm token={token!} onSuccess={onSuccess} />
        ) : (
          <Success />
        )
      }
    </TokenChecker>
  );
};

const enhanced = withRouteConfig<Props>({
  render: ({ match, Component }) => (
    <Component token={parseHashQuery(match.location.hash).confirmToken} />
  ),
})(ConfirmRoute);

export default enhanced;
