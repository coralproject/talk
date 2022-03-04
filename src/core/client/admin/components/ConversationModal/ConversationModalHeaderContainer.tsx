import { Localized } from "@fluent/react/compat";
import { useRouter } from "found";
import React, { FunctionComponent, RefObject, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { getModerationLink } from "coral-framework/helpers";
import { Button, HorizontalGutter, ModalHeader } from "coral-ui/components/v2";

import { ConversationModalHeaderContainer_comment$key as ConversationModalHeaderContainer_comment } from "coral-admin/__generated__/ConversationModalHeaderContainer_comment.graphql";

import styles from "./ConversationModalHeaderContainer.css";

interface Props {
  comment: ConversationModalHeaderContainer_comment;
  onClose: () => void;
  focusableRef: RefObject<any>;
}

const ConversationModalHeaderContainer: FunctionComponent<Props> = ({
  comment,
  onClose,
  focusableRef,
}) => {
  const commentData = useFragment(
    graphql`
      fragment ConversationModalHeaderContainer_comment on Comment {
        story {
          id
          metadata {
            title
          }
          url
        }
        id
      }
    `,
    comment
  );

  const { router } = useRouter();
  const onModerate = useCallback(() => {
    const link = getModerationLink({ storyID: commentData.story.id });
    router.push(link);
  }, [commentData.story.id, router]);
  return (
    <ModalHeader onClose={onClose} focusableRef={focusableRef}>
      <HorizontalGutter spacing={3}>
        <h1 className={styles.title}>
          <Localized id="conversation-modal-conversationOn">
            <span className={styles.conversationTitle}>Conversation on:</span>
          </Localized>
          {commentData.story.metadata
            ? commentData.story.metadata.title
            : commentData.story.url}
        </h1>
        <Localized id="conversation-modal-moderateStory">
          <Button
            variant="outlined"
            color="mono"
            uppercase
            onClick={onModerate}
          >
            Moderate story
          </Button>
        </Localized>
      </HorizontalGutter>
    </ModalHeader>
  );
};

export default ConversationModalHeaderContainer;
