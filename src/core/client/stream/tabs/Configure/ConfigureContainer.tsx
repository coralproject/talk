import React from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { ConfigureContainer_organization as OrgData } from "coral-stream/__generated__/ConfigureContainer_organization.graphql";
import { ConfigureContainer_story as StoryData } from "coral-stream/__generated__/ConfigureContainer_story.graphql";
import { ConfigureContainer_viewer as ViewerData } from "coral-stream/__generated__/ConfigureContainer_viewer.graphql";

import Configure from "./Configure";

interface ConfigureContainerProps {
  viewer: ViewerData;
  story: StoryData;
  organization: OrgData;
}

export class StreamContainer extends React.Component<ConfigureContainerProps> {
  public render() {
    return (
      <Configure
        story={this.props.story}
        organization={this.props.organization}
        viewer={this.props.viewer}
      />
    );
  }
}
const enhanced = withFragmentContainer<ConfigureContainerProps>({
  story: graphql`
    fragment ConfigureContainer_story on Story {
      ...ConfigureStreamContainer_story
      ...OpenOrCloseStreamContainer_story
      ...ModerateStreamContainer_story
    }
  `,
  viewer: graphql`
    fragment ConfigureContainer_viewer on User {
      ...UserBoxContainer_viewer
    }
  `,
  organization: graphql`
    fragment ConfigureContainer_organization on Organization {
      ...UserBoxContainer_organization
      ...ModerateStreamContainer_organization
    }
  `,
})(StreamContainer);

export default enhanced;
