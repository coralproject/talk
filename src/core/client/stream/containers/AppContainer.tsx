import React from "react";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { graphql, withLocalStateContainer } from "talk-framework/lib/relay";
import { AppContainerLocal as Local } from "talk-stream/__generated__/AppContainerLocal.graphql";
import {
  SetActiveTabInput,
  SetActiveTabMutation,
  withSetActiveTabMutation,
} from "talk-stream/mutations";

import { AppContainer_asset as AssetData } from "talk-stream/__generated__/AppContainer_asset.graphql";
import App from "../components/App";

interface InnerProps {
  local: Local;
  setActiveTab: SetActiveTabMutation;
  asset: AssetData;
}

class AppContainer extends React.Component<InnerProps> {
  private handleSetActiveTab = (tab: SetActiveTabInput["tab"]) => {
    this.props.setActiveTab({ tab });
  };

  public render() {
    const {
      local: { activeTab },
      asset,
    } = this.props;

    return (
      <App
        activeTab={activeTab}
        onTabClick={this.handleSetActiveTab}
        commentCount={asset.commentCounts.totalVisible}
      />
    );
  }
}

const enhanced = withSetActiveTabMutation(
  withFragmentContainer<InnerProps>({
    asset: graphql`
      fragment AppContainer_asset on Asset {
        commentCounts {
          totalVisible
        }
      }
    `,
  })(
    withLocalStateContainer(
      graphql`
        fragment AppContainerLocal on Local {
          activeTab
        }
      `
    )(AppContainer)
  )
);

export default enhanced;
