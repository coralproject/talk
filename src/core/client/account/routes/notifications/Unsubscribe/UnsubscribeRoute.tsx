import React, { useCallback, useState } from "react";
import { Environment } from "relay-runtime";

import Loading from "coral-account/components/Loading";
import { useToken } from "coral-framework/hooks";
import { createFetch } from "coral-framework/lib/relay";
import { withRouteConfig } from "coral-framework/lib/router";
import { parseHashQuery } from "coral-framework/utils";

import Sorry from "./Sorry";
import Success from "./Success";
import UnsubscribeForm from "./UnsubscribeForm";

import styles from "./UnsubscribeRoute.css";

const fetcher = createFetch(
  "unsubscribeToken",
  async (environment: Environment, variables: { token: string }, { rest }) =>
    await rest.fetch<void>("/account/notifications/unsubscribe", {
      method: "GET",
      token: variables.token,
    })
);

interface Props {
  token: string | undefined;
}

const UnsubscribeRoute: React.FunctionComponent<Props> = ({ token }) => {
  const [finished, setFinished] = useState(false);
  const onSuccess = useCallback(() => {
    setFinished(true);
  }, []);
  const [state, error] = useToken(fetcher, token);

  if (state === "UNCHECKED") {
    return (
      <div className={styles.container}>
        <div className={styles.root}>
          <Loading />
        </div>
      </div>
    );
  }

  if (state !== "VALID" || error) {
    return (
      <div className={styles.container}>
        <div className={styles.root}>
          <Sorry reason={error} />
        </div>
      </div>
    );
  }

  return !finished ? (
    <div className={styles.container}>
      <div className={styles.root}>
        <UnsubscribeForm token={token!} onSuccess={onSuccess} />
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.root}>
        <Success />
      </div>
    </div>
  );
};

const enhanced = withRouteConfig<Props>({
  render: function UnsubscribeRouteRender({ match, Component }) {
    return (
      <Component token={parseHashQuery(match.location.hash).unsubscribeToken} />
    );
  },
})(UnsubscribeRoute);

export default enhanced;
