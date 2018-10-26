import * as React from "react";
import { Component } from "react";

import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";

import { TabBarContainer_asset as AssetData } from "talk-stream/__generated__/TabBarContainer_asset.graphql";
import { TabBarContainerLocal as Local } from "talk-stream/__generated__/TabBarContainerLocal.graphql";
import {
  SetActiveTabInput,
  SetActiveTabMutation,
  withSetActiveTabMutation,
} from "talk-stream/mutations";

import TabBar from "../components/TabBar";

interface InnerProps {
  asset: AssetData | null;
  local: Local;
  setActiveTab: SetActiveTabMutation;
}

export class TabBarContainer extends Component<InnerProps> {
  private handleSetActiveTab = (tab: SetActiveTabInput["tab"]) => {
    this.props.setActiveTab({ tab });
  };

  public render() {
    const {
      local: { loggedIn, activeTab },
      asset,
    } = this.props;

    const commentCount = (asset && asset.commentCounts.totalVisible) || -1;
    return (
      <TabBar
        activeTab={activeTab}
        commentCount={commentCount}
        showProfileTab={loggedIn}
        onTabClick={this.handleSetActiveTab}
      />
    );
  }
}

const enhanced = withSetActiveTabMutation(
  withLocalStateContainer(
    graphql`
      fragment TabBarContainerLocal on Local {
        loggedIn
        activeTab
      }
    `
  )(
    withFragmentContainer<InnerProps>({
      asset: graphql`
        fragment TabBarContainer_asset on Asset {
          commentCounts {
            totalVisible
          }
        }
      `,
    })(TabBarContainer)
  )
);

export default enhanced;
