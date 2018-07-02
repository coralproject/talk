import * as React from "react";
import { StatelessComponent } from "react";

import { Center } from "talk-ui/components";

import AssetListContainer from "../containers/AssetListContainer";
import StreamContainer from "../containers/StreamContainer";

export interface AppProps {
  assets?: any | null;
  asset?: {} | null;
}

const App: StatelessComponent<AppProps> = props => {
  if (props.assets) {
    return <AssetListContainer assets={props.assets} />;
  }
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
