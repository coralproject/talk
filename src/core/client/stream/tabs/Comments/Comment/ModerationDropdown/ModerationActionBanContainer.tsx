import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
import { DropdownDivider } from "coral-ui/components/v2";

import { ModerationActionBanContainer_settings } from "coral-stream/__generated__/ModerationActionBanContainer_settings.graphql";
import { ModerationActionBanContainer_story } from "coral-stream/__generated__/ModerationActionBanContainer_story.graphql";
import { ModerationActionBanContainer_user } from "coral-stream/__generated__/ModerationActionBanContainer_user.graphql";
import { ModerationActionBanContainer_viewer } from "coral-stream/__generated__/ModerationActionBanContainer_viewer.graphql";

import ModerationActionBanButton from "./ModerationActionBanButton";

interface Props {
  /** user in question or null if still loading */
  user: ModerationActionBanContainer_user | null;
  settings: ModerationActionBanContainer_settings | null;
  story: ModerationActionBanContainer_story | null;
  viewer: ModerationActionBanContainer_viewer | null;
  onBan: () => void;
  onSiteBan: () => void;
}

const ModerationActionBanContainer: FunctionComponent<Props> = ({
  user,
  settings,
  story,
  viewer,
  onBan,
  onSiteBan,
}) => {
  // on multisite, a site moderator cannot ban an org mod or admin
  const viewerCannotBanUser = useMemo(() => {
    return (
      viewer?.role === GQLUSER_ROLE.MODERATOR &&
      viewer?.moderationScopes?.scoped &&
      (user?.role === GQLUSER_ROLE.ADMIN ||
        (user?.role === GQLUSER_ROLE.MODERATOR &&
          !user.moderationScopes?.scoped))
    );
  }, [viewer, user]);

  if (viewerCannotBanUser) {
    return null;
  }

  const viewerScoped =
    viewer?.moderationScopes && viewer.moderationScopes.scoped;

  const siteBans = user?.status.ban.sites?.map((s) => s.id);
  const userIsAllSiteBanned =
    !!user?.status.ban.active && !(siteBans && siteBans.length > 0);
  const userIsSiteBanned =
    story?.site && siteBans && siteBans.includes(story.site.id);

  return (
    <>
      <DropdownDivider />
      {settings?.multisite ? (
        <>
          <ModerationActionBanButton
            disabled={!user || !!userIsSiteBanned || userIsAllSiteBanned}
            allSiteBan={false}
            onClick={!user ? undefined : onSiteBan}
            showSpinner={!user}
          />
          {!viewerScoped && (
            <ModerationActionBanButton
              disabled={!user || userIsAllSiteBanned}
              allSiteBan={true}
              onClick={!user ? undefined : onBan}
              showSpinner={!user}
            />
          )}
        </>
      ) : (
        <>
          <ModerationActionBanButton
            disabled={!user || userIsAllSiteBanned}
            allSiteBan={true}
            onClick={!user ? undefined : onBan}
            showSpinner={!user}
          />
        </>
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment ModerationActionBanContainer_user on User {
      id
      status {
        ban {
          active
          sites {
            id
          }
        }
      }
      role
      moderationScopes {
        scoped
      }
    }
  `,
  settings: graphql`
    fragment ModerationActionBanContainer_settings on Settings {
      multisite
    }
  `,
  story: graphql`
    fragment ModerationActionBanContainer_story on Story {
      site {
        id
      }
    }
  `,
  viewer: graphql`
    fragment ModerationActionBanContainer_viewer on User {
      moderationScopes {
        scoped
      }
      role
    }
  `,
})(ModerationActionBanContainer);

export default enhanced;
