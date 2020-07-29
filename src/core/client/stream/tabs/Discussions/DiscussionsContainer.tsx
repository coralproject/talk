import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { DiscussionsContainer_settings } from "coral-stream/__generated__/DiscussionsContainer_settings.graphql";
import { DiscussionsContainer_story } from "coral-stream/__generated__/DiscussionsContainer_story.graphql";
import { DiscussionsContainer_viewer } from "coral-stream/__generated__/DiscussionsContainer_viewer.graphql";

import MostActiveDiscussionsContainer from "./MostActiveDiscussionsContainer";
import MyOngoingDiscussionsContainer from "./MyOngoingDiscussionsContainer";

interface Props {
  viewer: DiscussionsContainer_viewer;
  settings: DiscussionsContainer_settings;
  story: DiscussionsContainer_story;
}

const DiscussionsContainer: FunctionComponent<Props> = (props) => {
  return (
    <>
      <MyOngoingDiscussionsContainer
        viewer={props.viewer}
        currentSiteID={props.story.site.id}
        settings={props.settings}
      />
      <MostActiveDiscussionsContainer site={props.story.site} />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment DiscussionsContainer_story on Story {
      site {
        id
        ...MostActiveDiscussionsContainer_site
      }
    }
  `,
  viewer: graphql`
    fragment DiscussionsContainer_viewer on User {
      ...MyOngoingDiscussionsContainer_viewer
    }
  `,
  settings: graphql`
    fragment DiscussionsContainer_settings on Settings {
      ...MyOngoingDiscussionsContainer_settings
      organization {
        name
      }
    }
  `,
})(DiscussionsContainer);

export default enhanced;
