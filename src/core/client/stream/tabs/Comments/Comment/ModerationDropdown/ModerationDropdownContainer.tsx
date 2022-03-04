import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql, useFragment } from "react-relay";

import { useViewerEvent } from "coral-framework/lib/events";
import CLASSES from "coral-stream/classes";
import { ShowModerationPopoverEvent } from "coral-stream/events";
import { Dropdown } from "coral-ui/components/v2";

import { ModerationDropdownContainer_comment$key as ModerationDropdownContainer_comment } from "coral-stream/__generated__/ModerationDropdownContainer_comment.graphql";
import { ModerationDropdownContainer_settings$key as ModerationDropdownContainer_settings } from "coral-stream/__generated__/ModerationDropdownContainer_settings.graphql";
import { ModerationDropdownContainer_story$key as ModerationDropdownContainer_story } from "coral-stream/__generated__/ModerationDropdownContainer_story.graphql";
import { ModerationDropdownContainer_viewer$key as ModerationDropdownContainer_viewer } from "coral-stream/__generated__/ModerationDropdownContainer_viewer.graphql";

import UserBanPopoverContainer from "../UserBanPopover/UserBanPopoverContainer";
import ModerationActionsContainer from "./ModerationActionsContainer";

type View = "MODERATE" | "BAN";

interface Props {
  comment: ModerationDropdownContainer_comment;
  story: ModerationDropdownContainer_story;
  viewer: ModerationDropdownContainer_viewer;
  settings: ModerationDropdownContainer_settings;
  onDismiss: () => void;
  scheduleUpdate: () => void;
}

const ModerationDropdownContainer: FunctionComponent<Props> = ({
  comment,
  story,
  viewer,
  settings,
  onDismiss,
  scheduleUpdate,
}) => {
  const commentData = useFragment(
    graphql`
      fragment ModerationDropdownContainer_comment on Comment {
        id
        author {
          id
          username
        }
        revision {
          id
        }
        status
        tags {
          code
        }
        ...ModerationActionsContainer_comment
        ...UserBanPopoverContainer_comment
      }
    `,
    comment
  );
  const storyData = useFragment(
    graphql`
      fragment ModerationDropdownContainer_story on Story {
        id
        ...ModerationActionsContainer_story
        ...UserBanPopoverContainer_story
      }
    `,
    story
  );
  const settingsData = useFragment(
    graphql`
      fragment ModerationDropdownContainer_settings on Settings {
        ...ModerationActionsContainer_settings
      }
    `,
    settings
  );
  const viewerData = useFragment(
    graphql`
      fragment ModerationDropdownContainer_viewer on User {
        ...ModerationActionsContainer_viewer
      }
    `,
    viewer
  );

  const emitShowEvent = useViewerEvent(ShowModerationPopoverEvent);
  const [view, setView] = useState<View>("MODERATE");
  const onBan = useCallback(() => {
    setView("BAN");
    scheduleUpdate();
  }, [setView, scheduleUpdate]);

  // run once.
  useEffect(() => {
    emitShowEvent({ commentID: commentData.id });
  }, [commentData.id, emitShowEvent]);

  return (
    <div>
      {view === "MODERATE" ? (
        <Dropdown className={CLASSES.moderationDropdown.$root}>
          <ModerationActionsContainer
            comment={commentData}
            story={storyData}
            viewer={viewerData}
            settings={settingsData}
            onDismiss={onDismiss}
            onBan={onBan}
          />
        </Dropdown>
      ) : (
        <UserBanPopoverContainer
          comment={commentData}
          story={storyData}
          onDismiss={onDismiss}
        />
      )}
    </div>
  );
};

export default ModerationDropdownContainer;
