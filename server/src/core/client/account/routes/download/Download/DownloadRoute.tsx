import React, { FunctionComponent } from "react";
import { Environment } from "relay-runtime";

import Loading from "coral-account/components/Loading";
import { useToken } from "coral-framework/hooks";
import { createFetch } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { parseHashQuery } from "coral-framework/utils";
import { HorizontalGutter } from "coral-ui/components/v2";

import DownloadDescription from "./DownloadDescription";
import DownloadForm from "./DownloadForm";
import Sorry from "./Sorry";

import styles from "./DownloadRoute.css";

const fetcher = createFetch(
  "downloadToken",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/account/download", {
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
      <main className={styles.container}>
        <div className={styles.root}>
          <HorizontalGutter size="double">
            <Loading />
          </HorizontalGutter>
        </div>
      </main>
    );
  }
  if (state !== "VALID" || error) {
    return (
      <main className={styles.container}>
        <div className={styles.root}>
          <HorizontalGutter size="double">
            <DownloadDescription />
            <Sorry />
          </HorizontalGutter>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.root}>
        <DownloadDescription />
        <DownloadForm token={token!} />
      </div>
    </main>
  );
};

const enhanced = withRouteConfig<Props>({
  render: function DownloadRouteRender({ match, Component }) {
    return (
      <Component token={parseHashQuery(match.location.hash).downloadToken} />
    );
  },
})(DownloadRoute);

export default enhanced;
