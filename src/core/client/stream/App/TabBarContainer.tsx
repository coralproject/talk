import * as React from "react";
import { Component } from "react";

import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";

import { TabBarContainer_viewer as ViewerData } from "coral-stream/__generated__/TabBarContainer_viewer.graphql";
import { TabBarContainerLocal as Local } from "coral-stream/__generated__/TabBarContainerLocal.graphql";
import { Ability, can } from "coral-stream/permissions";

import {
  SetActiveTabInput,
  SetActiveTabMutation,
  withSetActiveTabMutation,
} from "./SetActiveTabMutation";
import TabBar from "./TabBar";

interface Props {
  viewer: ViewerData | null;
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
    } = this.props;

    return (
      <TabBar
        activeTab={activeTab}
        showProfileTab={loggedIn}
        showConfigureTab={
          !!this.props.viewer &&
          can(this.props.viewer, Ability.CHANGE_STORY_CONFIGURATION)
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
      viewer: graphql`
        fragment TabBarContainer_viewer on User {
          role
        }
      `,
    })(TabBarContainer)
  )
);

export default enhanced;
