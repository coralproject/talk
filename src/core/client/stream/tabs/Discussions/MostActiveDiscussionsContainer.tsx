import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import CLASSES from "coral-stream/classes";
import { HorizontalGutter } from "coral-ui/components/v2";

import { MostActiveDiscussionsContainer_site$key as MostActiveDiscussionsContainer_site } from "coral-stream/__generated__/MostActiveDiscussionsContainer_site.graphql";

import DiscussionsHeader from "./DiscussionsHeader";
import StoryRowContainer from "./StoryRowContainer";

import styles from "./MostActiveDiscussionsContainer.css";

interface Props {
  site: MostActiveDiscussionsContainer_site;
}

const MostActiveDiscussionsContainer: FunctionComponent<Props> = ({ site }) => {
  const siteData = useFragment(
    graphql`
      fragment MostActiveDiscussionsContainer_site on Site {
        id
        name
        topStories {
          id
          ...StoryRowContainer_story
        }
      }
    `,
    site
  );

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
            $siteName={siteData.name}
          >
            <>
              Ranked by the most comments received over the last 24 hours on{" "}
              {siteData.name}
            </>
          </Localized>
        }
        icon="show_chart"
      />
      <ol className={cn(styles.list, CLASSES.discussions.discussionsList)}>
        {siteData.topStories.map((story) => (
          <li
            className={cn(styles.listItem, CLASSES.discussions.story.$root)}
            key={story.id}
          >
            <StoryRowContainer story={story} currentSiteID={siteData.id} />
          </li>
        ))}
      </ol>
    </HorizontalGutter>
  );
};

export default MostActiveDiscussionsContainer;
