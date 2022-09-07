import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { HorizontalGutter } from "coral-ui/components/v2";

import { MostActiveDiscussionsContainer_site } from "coral-stream/__generated__/MostActiveDiscussionsContainer_site.graphql";

import DiscussionsHeader from "./DiscussionsHeader";
import StoryRowContainer from "./StoryRowContainer";

import styles from "./MostActiveDiscussionsContainer.css";

interface Props {
  site: MostActiveDiscussionsContainer_site;
}

const MostActiveDiscussionsContainer: FunctionComponent<Props> = ({ site }) => {
  return (
    <HorizontalGutter
      spacing={4}
      className={cn(styles.root, CLASSES.discussions.mostActiveDiscussions)}
      container="section"
      aria-labelledby="discussions-mostActiveDiscussions-title"
    >
      <DiscussionsHeader
        header={
          <Localized id="discussions-mostActiveDiscussions">
            <span id="discussions-mostActiveDiscussions-title">
              Most active discussions
            </span>
          </Localized>
        }
        subHeader={
          <Localized
            id="discussions-mostActiveDiscussions-subhead"
            vars={{ siteName: site.name }}
          >
            <>
              Ranked by the most comments received over the last 24 hours on{" "}
              {site.name}
            </>
          </Localized>
        }
        icon="show_chart"
      />
      <ol className={cn(styles.list, CLASSES.discussions.discussionsList)}>
        {site.topStories.map((story) => (
          <li
            className={cn(styles.listItem, CLASSES.discussions.story.$root)}
            key={story.id}
          >
            <StoryRowContainer story={story} currentSiteID={site.id} />
          </li>
        ))}
      </ol>
    </HorizontalGutter>
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
