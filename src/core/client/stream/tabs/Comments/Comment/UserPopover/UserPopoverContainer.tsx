import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import { useViewerEvent } from "coral-framework/lib/events";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ShowUserPopoverEvent } from "coral-stream/events";

import { UserPopoverContainer_settings } from "coral-stream/__generated__/UserPopoverContainer_settings.graphql";
import { UserPopoverContainer_user as UserData } from "coral-stream/__generated__/UserPopoverContainer_user.graphql";
import { UserPopoverContainer_viewer as ViewerData } from "coral-stream/__generated__/UserPopoverContainer_viewer.graphql";

import UserIgnorePopoverContainer from "../UserIgnorePopover/UserIgnorePopoverContainer";
import UserPopoverOverviewContainer from "./UserPopoverOverviewContainer";

type View = "OVERVIEW" | "IGNORE";

interface Props {
  onDismiss: () => void;
  user: UserData;
  viewer: ViewerData | null;
  settings: UserPopoverContainer_settings;
}

export const UserPopoverContainer: FunctionComponent<Props> = ({
  user,
  viewer,
  onDismiss,
  settings,
}) => {
  const emitShowUserPopover = useViewerEvent(ShowUserPopoverEvent);
  useEffect(() => {
    emitShowUserPopover({ userID: user.id });
  }, []);
  const [view, setView] = useState<View>("OVERVIEW");
  const onIgnore = useCallback(() => setView("IGNORE"), [setView]);
  return (
    <div>
      {view === "OVERVIEW" ? (
        <UserPopoverOverviewContainer
          user={user}
          viewer={viewer}
          settings={settings}
          onIgnore={onIgnore}
        />
      ) : (
        <UserIgnorePopoverContainer user={user} onDismiss={onDismiss} />
      )}
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UserPopoverContainer_viewer on User {
      ...UserPopoverOverviewContainer_viewer
    }
  `,
  user: graphql`
    fragment UserPopoverContainer_user on User {
      id
      ...UserPopoverOverviewContainer_user
      ...UserIgnorePopoverContainer_user
    }
  `,
  settings: graphql`
    fragment UserPopoverContainer_settings on Settings {
      ...UserPopoverOverviewContainer_settings
    }
  `,
})(UserPopoverContainer);

export default enhanced;
