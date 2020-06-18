import React, { Component } from "react";
import { graphql } from "react-relay";

import {
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { GQLSTORY_MODE } from "coral-framework/schema";
import { Ability, can } from "coral-stream/permissions";

import { TabBarContainer_story } from "coral-stream/__generated__/TabBarContainer_story.graphql";
import { TabBarContainer_viewer as ViewerData } from "coral-stream/__generated__/TabBarContainer_viewer.graphql";
import { TabBarContainerLocal as Local } from "coral-stream/__generated__/TabBarContainerLocal.graphql";

import {
  SetActiveTabInput,
  SetActiveTabMutation,
  withSetActiveTabMutation,
} from "./SetActiveTabMutation";
import TabBar from "./TabBar";

interface Props {
  story: TabBarContainer_story | null;
  viewer: ViewerData | null;
  local: Local;
  setActiveTab: SetActiveTabMutation;
}

export class TabBarContainer extends Component<Props> {
  private handleSetActiveTab = (tab: SetActiveTabInput["tab"]) => {
    void this.props.setActiveTab({ tab });
  };

  public render() {
    const {
      local: { activeTab },
      viewer,
    } = this.props;

    return (
      <TabBar
        mode={
          this.props.story
            ? this.props.story.settings.mode
            : GQLSTORY_MODE.COMMENTS
        }
        activeTab={activeTab}
        showProfileTab={Boolean(viewer)}
        showConfigureTab={
          !!viewer && can(viewer, Ability.CHANGE_STORY_CONFIGURATION)
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
        activeTab
      }
    `
  )(
    withFragmentContainer<Props>({
      viewer: graphql`
        fragment TabBarContainer_viewer on User {
          role
        }
      `,
      story: graphql`
        fragment TabBarContainer_story on Story {
          settings {
            mode
          }
        }
      `,
    })(TabBarContainer)
  )
);

export default enhanced;
