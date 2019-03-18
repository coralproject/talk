import * as React from "react";
import { Component } from "react";

import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";

import { TabBarContainer_me as MeData } from "talk-stream/__generated__/TabBarContainer_me.graphql";
import { TabBarContainer_story as StoryData } from "talk-stream/__generated__/TabBarContainer_story.graphql";
import { TabBarContainerLocal as Local } from "talk-stream/__generated__/TabBarContainerLocal.graphql";
import { roleIsAtLeast } from "talk-stream/helpers";
import {
  SetActiveTabInput,
  SetActiveTabMutation,
  withSetActiveTabMutation,
} from "talk-stream/mutations";

import TabBar from "../components/TabBar";

interface Props {
  story: StoryData | null;
  me: MeData | null;
  local: Local;
  setActiveTab: SetActiveTabMutation;
}

export class TabBarContainer extends Component<Props> {
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
        showConfigureTab={
          !!this.props.me && roleIsAtLeast(this.props.me.role, "MODERATOR")
        }
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
    withFragmentContainer<Props>({
      me: graphql`
        fragment TabBarContainer_me on User {
          role
        }
      `,
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
