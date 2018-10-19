import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "talk-framework/lib/relay";
import { ProfileContainer_asset as AssetData } from "talk-stream/__generated__/ProfileContainer_asset.graphql";
import { ProfileContainer_me as MeData } from "talk-stream/__generated__/ProfileContainer_me.graphql";

import Profile from "../components/Profile";

interface ProfileContainerProps {
  me: MeData;
  asset: AssetData;
}

export class StreamContainer extends React.Component<ProfileContainerProps> {
  public render() {
    return <Profile me={this.props.me} asset={this.props.asset} />;
  }
}
const enhanced = withFragmentContainer<ProfileContainerProps>({
  asset: graphql`
    fragment ProfileContainer_asset on Asset {
      ...CommentHistoryContainer_asset
    }
  `,
  me: graphql`
    fragment ProfileContainer_me on User {
      ...UserBoxContainer_me
      ...CommentHistoryContainer_me
    }
  `,
})(StreamContainer);

export default enhanced;
