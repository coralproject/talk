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

import styles from "./ResetRoute.css";

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
    return (
      <main className={styles.container}>
        <div className={styles.root}>
          <Loading />
        </div>
      </main>
    );
  }

  if (state !== "VALID" || error) {
    return (
      <main className={styles.container}>
        <div className={styles.root}>
          <Sorry reason={error} />
        </div>
      </main>
    );
  }

  return !finished ? (
    <main className={styles.container}>
      <div className={styles.root}>
        <ResetPasswordForm token={token!} onSuccess={onSuccess} />
      </div>
    </main>
  ) : (
    <main className={styles.container}>
      <div className={styles.root}>
        <Success />
      </div>
    </main>
  );
};

const enhanced = withRouteConfig<Props>({
  render: function ResetRouteRender({ match, Component }) {
    return <Component token={parseHashQuery(match.location.hash).resetToken} />;
  },
})(ResetRoute);

export default enhanced;
