import React, { FunctionComponent, useEffect, useState } from "react";

import { ERROR_CODES } from "coral-common/errors";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useFetch } from "coral-framework/lib/relay";
import { CallOut, Flex, Typography } from "coral-ui/components";

import CheckInstallFetch from "./CheckInstallFetch";
import InstallWizard from "./InstallWizard";
import MainBar from "./MainBar";
import Wizard from "./Wizard";

import styles from "./App.css";

type State = "loading" | "success" | "failure";

const App: FunctionComponent = () => {
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<State>("loading");
  const checkInstall = useFetch(CheckInstallFetch);
  const context = useCoralContext();
  useEffect(() => {
    async function check() {
      try {
        await checkInstall({});
        setState("success");
      } catch (err) {
        setError(err.message);
        setState("failure");
        if (err.code !== ERROR_CODES.RATE_LIMIT_EXCEEDED) {
          await context.clearSession("");
        }
      }
    }

    check();
  }, []);

  return (
    <div className={styles.root}>
      <MainBar />
      <div className={styles.container}>
        <AppState state={state} error={error} />
      </div>
    </div>
  );
};

interface AppStateProps {
  state: State;
  error: string | null;
}

const AppState: FunctionComponent<AppStateProps> = ({ state, error }) => {
  switch (state) {
    case "loading":
      return null;
    case "success":
      return <InstallWizard />;
    default:
      return <FailedAppState error={error} />;
  }
};

interface FailedAppStateProps {
  error: string | null;
}

const FailedAppState: FunctionComponent<FailedAppStateProps> = ({ error }) => (
  <Wizard currentStep={0}>
    <Flex justifyContent="center">
      <CallOut color="error">
        <Typography variant="bodyCopy">{error}</Typography>
      </CallOut>
    </Flex>
  </Wizard>
);

export default App;
