import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, Icon } from "coral-ui/components/v2";

import { MyOngoingDiscussionsContainer_settings } from "coral-stream/__generated__/MyOngoingDiscussionsContainer_settings.graphql";
import { MyOngoingDiscussionsContainer_viewer } from "coral-stream/__generated__/MyOngoingDiscussionsContainer_viewer.graphql";

// import Discussions from "./Discussions";
import StoryRowContainer from "./StoryRowContainer";

interface Props {
  viewer: MyOngoingDiscussionsContainer_viewer;
  settings: MyOngoingDiscussionsContainer_settings;
  currentSiteID: string;
}

const MyOngoingDiscussionsContainer: FunctionComponent<Props> = ({
  viewer,
  settings,
  currentSiteID,
}) => {
  return (
    <div>
      <div>
        <Flex>
          <Icon>history</Icon>
          <Localized id="discussions-myOngoingDiscussions">
            <h2>My ongoing discussions</h2>
          </Localized>
        </Flex>

        <Localized
          id="discussions-myOngoingDiscussions-subhead"
          $orgName={settings.organization.name}
        >
          <p>
            Ranked by the most comments received over the last 24 hours on{" "}
            {settings.organization.name}
          </p>
        </Localized>
        <ul>
          {viewer.ongoingDiscussions.map((story) => (
            <StoryRowContainer
              story={story}
              key={story.id}
              currentSiteID={currentSiteID}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment MyOngoingDiscussionsContainer_viewer on User {
      ongoingDiscussions {
        id
        ...StoryRowContainer_story
      }
    }
  `,
  settings: graphql`
    fragment MyOngoingDiscussionsContainer_settings on Settings {
      organization {
        name
      }
    }
  `,
})(MyOngoingDiscussionsContainer);

export default enhanced;
