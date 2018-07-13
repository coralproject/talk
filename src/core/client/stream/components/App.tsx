import * as React from "react";
import { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import StreamContainer from "../containers/StreamContainer";

export interface AppProps {
  asset: {} | null;
}

const App: StatelessComponent<AppProps> = props => {
  if (props.asset) {
    return (
      <Flex justifyContent="center">
        <StreamContainer asset={props.asset} />
      </Flex>
    );
  }
  return <div>Asset not found </div>;
};

export default App;
