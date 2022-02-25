import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql, useFragment } from "react-relay";

import { useViewerEvent } from "coral-framework/lib/events";
import { ShowUserPopoverEvent } from "coral-stream/events";

import { UserPopoverContainer_settings$key } from "coral-stream/__generated__/UserPopoverContainer_settings.graphql";
import { UserPopoverContainer_user$key } from "coral-stream/__generated__/UserPopoverContainer_user.graphql";
import { UserPopoverContainer_viewer$key } from "coral-stream/__generated__/UserPopoverContainer_viewer.graphql";

import UserIgnorePopoverContainer from "../UserIgnorePopover/UserIgnorePopoverContainer";
import UserPopoverOverviewContainer from "./UserPopoverOverviewContainer";

type View = "OVERVIEW" | "IGNORE";

interface Props {
  onDismiss: () => void;
  user: UserPopoverContainer_user$key;
  viewer: UserPopoverContainer_viewer$key | null;
  settings: UserPopoverContainer_settings$key;
}

export const UserPopoverContainer: FunctionComponent<Props> = ({
  user,
  viewer,
  onDismiss,
  settings,
}) => {
  const userData = useFragment(
    graphql`
      fragment UserPopoverContainer_user on User {
        id
        ...UserPopoverOverviewContainer_user
        ...UserIgnorePopoverContainer_user
      }
    `,
    user
  );
  const viewerData = useFragment(
    graphql`
      fragment UserPopoverContainer_viewer on User {
        ...UserPopoverOverviewContainer_viewer
      }
    `,
    viewer
  );
  const settingsData = useFragment(
    graphql`
      fragment UserPopoverContainer_settings on Settings {
        ...UserPopoverOverviewContainer_settings
      }
    `,
    settings
  );

  const emitShowUserPopover = useViewerEvent(ShowUserPopoverEvent);
  useEffect(() => {
    emitShowUserPopover({ userID: userData.id });
  }, [emitShowUserPopover, userData.id]);
  const [view, setView] = useState<View>("OVERVIEW");
  const onIgnore = useCallback(() => setView("IGNORE"), [setView]);
  return (
    <div>
      {view === "OVERVIEW" ? (
        <UserPopoverOverviewContainer
          user={userData}
          viewer={viewerData}
          settings={settingsData}
          onIgnore={onIgnore}
        />
      ) : (
        <UserIgnorePopoverContainer user={userData} onDismiss={onDismiss} />
      )}
    </div>
  );
};

export default UserPopoverContainer;
