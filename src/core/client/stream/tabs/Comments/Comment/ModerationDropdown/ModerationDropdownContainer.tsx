import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { ModerationDropdownContainer_comment } from "coral-stream/__generated__/ModerationDropdownContainer_comment.graphql";
import { ModerationDropdownContainer_story } from "coral-stream/__generated__/ModerationDropdownContainer_story.graphql";
import { Dropdown } from "coral-ui/components";

import UserBanPopoverContainer from "../UserBanPopover/UserBanPopoverContainer";
import ModerationActionsContainer from "./ModerationActionsContainer";

type View = "MODERATE" | "BAN";

interface Props {
  comment: ModerationDropdownContainer_comment;
  story: ModerationDropdownContainer_story;
  onDismiss: () => void;
  scheduleUpdate: () => void;
}

const ModerationDropdownContainer: FunctionComponent<Props> = ({
  comment,
  story,
  onDismiss,
  scheduleUpdate,
}) => {
  const [view, setView] = useState<View>("MODERATE");
  const onBan = useCallback(() => {
    setView("BAN");
    scheduleUpdate();
  }, [setView, scheduleUpdate]);

  return (
    <div>
      {view === "MODERATE" ? (
        <Dropdown>
          <ModerationActionsContainer
            comment={comment}
            story={story}
            onDismiss={onDismiss}
            onBan={onBan}
          />
        </Dropdown>
      ) : (
        <UserBanPopoverContainer user={comment.author!} onDismiss={onDismiss} />
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerationDropdownContainer_comment on Comment {
      id
      author {
        id
        username
        ...UserBanPopoverContainer_user
      }
      revision {
        id
      }
      status
      tags {
        code
      }
      ...ModerationActionsContainer_comment
    }
  `,
  story: graphql`
    fragment ModerationDropdownContainer_story on Story {
      id
      ...ModerationActionsContainer_story
    }
  `,
})(ModerationDropdownContainer);

export default enhanced;
