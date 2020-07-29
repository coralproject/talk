import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, Icon } from "coral-ui/components/v2";

import { MostActiveDiscussionsContainer_site } from "coral-stream/__generated__/MostActiveDiscussionsContainer_site.graphql";

import StoryRowContainer from "./StoryRowContainer";

interface Props {
  site: MostActiveDiscussionsContainer_site;
}

const MostActiveDiscussionsContainer: FunctionComponent<Props> = ({ site }) => {
  return (
    <div>
      <Flex>
        <Icon>show_chart</Icon>
        <Localized id="discussions-mostActiveDiscussions">
          <h2>Most active discussions</h2>
        </Localized>
      </Flex>

      <Localized
        id="discussions-mostActiveDiscussions-subhead"
        $siteName={site.name}
      >
        <p>
          Ranked by the most comments received over the last 24 hours on{" "}
          {site.name}
        </p>
      </Localized>
      <ol>
        {site.topStories.map((story) => (
          <StoryRowContainer
            story={story}
            key={story.id}
            currentSiteID={site.id}
          />
        ))}
      </ol>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment MostActiveDiscussionsContainer_site on Site {
      id
      name
      topStories {
        id
        ...StoryRowContainer_story
      }
    }
  `,
})(MostActiveDiscussionsContainer);

export default enhanced;
