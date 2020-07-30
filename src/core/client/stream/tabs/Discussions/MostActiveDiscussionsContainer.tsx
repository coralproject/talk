import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { MostActiveDiscussionsContainer_site } from "coral-stream/__generated__/MostActiveDiscussionsContainer_site.graphql";

import DiscussionsHeader from "./DiscussionsHeader";
import StoryRowContainer from "./StoryRowContainer";

import styles from "./MostActiveDiscussionsContainer.css";

interface Props {
  site: MostActiveDiscussionsContainer_site;
}

const MostActiveDiscussionsContainer: FunctionComponent<Props> = ({ site }) => {
  return (
    <div className={styles.root}>
      <DiscussionsHeader
        header={
          <Localized id="discussions-mostActiveDiscussions">
            Most active discussions
          </Localized>
        }
        subHeader={
          <Localized
            id="discussions-mostActiveDiscussions-subhead"
            $siteName={site.name}
          >
            <>
              Ranked by the most comments received over the last 24 hours on{" "}
              {site.name}
            </>
          </Localized>
        }
        icon="show_chart"
      />
      <ol className={styles.list}>
        {site.topStories.map((story) => (
          <li className={styles.listItem} key={story.id}>
            <StoryRowContainer story={story} currentSiteID={site.id} />
          </li>
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
