import * as React from "react";
import { StatelessComponent } from "react";

import { Center } from "talk-ui/components";

import AssetListContainer from "../containers/AssetListContainer";
import PostCommentFormContainer from "../containers/PostCommentFormContainer";
import StreamContainer from "../containers/StreamContainer";
import Logo from "./Logo";

export interface AppProps {
  assets?: any | null;
  asset?: {
    id: string;
    isClosed: boolean;
    comments: any | null;
  } | null;
}

const App: StatelessComponent<AppProps> = props => {
  if (props.assets) {
    return <AssetListContainer assets={props.assets} />;
  }
  if (props.asset) {
    return (
      <Center>
        <Logo gutterBottom />
        <StreamContainer comments={props.asset.comments} />
        <PostCommentFormContainer assetID={props.asset.id} />
      </Center>
    );
  }
  return <div>Asset not found </div>;
};

export default App;
