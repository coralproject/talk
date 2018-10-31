import * as React from "react";
import { Component } from "react";

import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";

import { TabBarContainer_story as StoryData } from "talk-stream/__generated__/TabBarContainer_story.graphql";
import { TabBarContainerLocal as Local } from "talk-stream/__generated__/TabBarContainerLocal.graphql";
import {
  SetActiveTabInput,
  SetActiveTabMutation,
  withSetActiveTabMutation,
} from "talk-stream/mutations";

import TabBar from "../components/TabBar";

interface InnerProps {
  story: StoryData | null;
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
      story,
    } = this.props;

    const commentCount = (story && story.commentCounts.totalVisible) || -1;
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
      story: graphql`
        fragment TabBarContainer_story on Story {
          commentCounts {
            totalVisible
          }
        }
      `,
    })(TabBarContainer)
  )
);

export default enhanced;
