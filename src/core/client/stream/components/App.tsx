import * as React from "react";
import { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import CommentsPaneContainer from "../tabs/comments/containers/CommentsPaneContainer";
import * as styles from "./App.css";

export interface AppProps {
  activeTab: "COMMENTS" | "%future added value";
}

const App: StatelessComponent<AppProps> = props => {
  let view: React.ReactElement<any>;
  switch (props.activeTab) {
    case "COMMENTS":
      view = <CommentsPaneContainer />;
      break;
    default:
      throw new Error(`Unknown tab ${props.activeTab}`);
  }
  return (
    <Flex justifyContent="center" className={styles.root}>
      {view}
    </Flex>
  );
};

export default App;
