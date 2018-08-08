import * as React from "react";
import { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import * as styles from "./App.css";

export interface AppProps {
  // TODO: (cvle) Remove %future added value when we have Relay 1.6
  // https://github.com/facebook/relay/commit/1e87e43add7667a494f7ff4cfa7f03f1ab8d81a2
  view: "SIGN_UP" | "SIGN_IN" | "FORGOT_PASSWORD" | "%future added value";
}

const App: StatelessComponent<AppProps> = props => {
  return (
    <Flex justifyContent="center" className={styles.root}>
      Show view {props.view}
    </Flex>
  );
};

export default App;
