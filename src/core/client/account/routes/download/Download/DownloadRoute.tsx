import React, { FunctionComponent } from "react";
import { Environment } from "relay-runtime";

import { useToken } from "coral-framework/hooks";
import { createFetch } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { parseHashQuery } from "coral-framework/utils";

import DownloadForm from "./DownloadForm";

const fetcher = createFetch(
  "downloadToken",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/account/downloadcheck", {
      method: "GET",
      token: variables.token,
    })
);

interface Props {
  token: string | undefined;
}

const DownloadRoute: FunctionComponent<Props> = ({ token }) => {
  const [state, error] = useToken(fetcher, token);

  if (state === "UNCHECKED") {
    return <div>Loading...</div>;
  }
  if (state !== "VALID" || error) {
    return (
      <div>
        <div>Sorry!</div>
      </div>
    );
  }

  return <DownloadForm token={token!} />;
};

const enhanced = withRouteConfig<Props>({
  render: ({ match, Component }) => (
    <Component token={parseHashQuery(match.location.hash).downloadToken} />
  ),
})(DownloadRoute);

export default enhanced;
