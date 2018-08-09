import * as React from "react";
import { StatelessComponent } from "react";

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
  return <div className={styles.root}>{view}</div>;
};

export default App;
