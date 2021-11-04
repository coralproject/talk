import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";
import { Button } from "coral-ui/components/v3/Button/Button";

import { ArchivedConfigurationContainer_story } from "coral-stream/__generated__/ArchivedConfigurationContainer_story.graphql";

import UnarchiveStoriesMutation from "./UnarchiveStoriesMutation";

import styles from "./ArchivedConfigurationContainer.css";

interface Props {
  story: ArchivedConfigurationContainer_story;
}

const ArchivedConfigurationContainer: FunctionComponent<Props> = ({
  story,
}) => {
  const unarchiveStories = useMutation(UnarchiveStoriesMutation);
  const unarchiveStory = useCallback(() => {
    void unarchiveStories({ storyIDs: [story.id] });
  }, [story.id, unarchiveStories]);

  return (
    <div className={styles.root}>
      <CallOut
        color="warning"
        aria-labelledby="configure-archived-title"
        container="section"
        title={
          <Localized id="configure-archived-title">
            <div id="configure-archived-title">
              This comment stream has been archived
            </div>
          </Localized>
        }
        icon={
          <Icon size="sm" className={styles.icon}>
            archive
          </Icon>
        }
      >
        <>
          <Localized id="configure-archived-onArchivedStream">
            <div className={styles.calloutText}>
              On archived streams, no new comments, reactions, or reports may be
              submitted. Also, comments cannot be moderated.
            </div>
          </Localized>
          <Localized id="configure-archived-toAllowTheseActions">
            <div className={styles.calloutText}>
              To allow these actions, unarchive the stream.
            </div>
          </Localized>

          <Localized id="configure-archived-unarchiveStream">
            <Button
              onClick={unarchiveStory}
              color="secondary"
              variant="filled"
              paddingSize="extraSmall"
              upperCase
            >
              Unarchive stream
            </Button>
          </Localized>
        </>
      </CallOut>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment ArchivedConfigurationContainer_story on Story {
      id
    }
  `,
})(ArchivedConfigurationContainer);

export default enhanced;
