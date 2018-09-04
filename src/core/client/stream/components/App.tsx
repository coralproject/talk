import * as React from "react";
import { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import PermalinkViewQuery from "../queries/PermalinkViewQuery";
import StreamQuery from "../queries/StreamQuery";
import * as styles from "./App.css";

export interface AppProps {
  showPermalinkView: boolean;
}

const App: StatelessComponent<AppProps> = props => {
  const view = props.showPermalinkView ? (
    <PermalinkViewQuery />
  ) : (
    <StreamQuery />
  );
  return (
    <Flex justifyContent="center" className={styles.root}>
      {view}
    </Flex>
  );
};

export default App;
