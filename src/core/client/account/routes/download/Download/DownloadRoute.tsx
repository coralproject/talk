import React, { FunctionComponent } from "react";
import { Environment } from "relay-runtime";

import Loading from "coral-account/components/Loading";
import { useToken } from "coral-framework/hooks";
import { createFetch } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { parseHashQuery } from "coral-framework/utils";
import { HorizontalGutter } from "coral-ui/components";

import DownloadDescription from "./DownloadDescription";
import DownloadForm from "./DownloadForm";
import Sorry from "./Sorry";

import styles from "./DownloadRoute.css";

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
    return (
      <div className={styles.container}>
        <div className={styles.root}>
          <HorizontalGutter size="double">
            <Loading />
          </HorizontalGutter>
        </div>
      </div>
    );
  }
  if (state !== "VALID" || error) {
    return (
      <div className={styles.container}>
        <div className={styles.root}>
          <HorizontalGutter size="double">
            <DownloadDescription />
            <Sorry />
          </HorizontalGutter>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.root}>
        <DownloadDescription />
        <DownloadForm token={token!} />
      </div>
    </div>
  );
};

const enhanced = withRouteConfig<Props>({
  render: ({ match, Component }) => (
    <Component token={parseHashQuery(match.location.hash).downloadToken} />
  ),
})(DownloadRoute);

export default enhanced;
