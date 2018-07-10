import * as React from "react";
import { StatelessComponent } from "react";

import { Center } from "talk-ui/components";

import StreamContainer from "../containers/StreamContainer";

export interface AppProps {
  asset: {} | null;
}

const App: StatelessComponent<AppProps> = props => {
  if (props.asset) {
    return (
      <Center>
        <StreamContainer asset={props.asset} />
      </Center>
    );
  }
  return <div>Asset not found </div>;
};

export default App;
