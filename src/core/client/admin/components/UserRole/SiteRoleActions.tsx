import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { useToggleState } from "coral-framework/hooks";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "coral-ui/components/v2";

import { SiteRoleActions_user } from "coral-admin/__generated__/SiteRoleActions_user.graphql";
import { SiteRoleActions_viewer } from "coral-admin/__generated__/SiteRoleActions_viewer.graphql";

import DemoteModeratorMutation from "./DemoteModeratorMutation";
import PromoteModeratorMutation from "./PromoteModeratorMutation";
import SiteRoleActionsModal from "./SiteRoleActionsModal";
import UserRoleChangeButton from "./UserRoleChangeButton";
import UserRoleText from "./UserRoleText";

import styles from "./SiteRoleActions.css";

interface Props {
  viewer: SiteRoleActions_viewer;
  user: SiteRoleActions_user;
}

const SiteRoleActions: FunctionComponent<Props> = ({ viewer, user }) => {
  const promoteModerator = useMutation(PromoteModeratorMutation);
  const demoteModerator = useMutation(DemoteModeratorMutation);

  const [mode, setMode] = useState<"promote" | "demote" | null>(null);
  const [isModalVisible, , toggleModalVisibility] = useToggleState();
  const [isPopoverVisible, , togglePopoverVisibility] = useToggleState();

  const onPromote = useCallback(() => {
    setMode("promote");
    togglePopoverVisibility();
    toggleModalVisibility();
  }, [toggleModalVisibility, togglePopoverVisibility]);

  const onDemote = useCallback(async () => {
    setMode("demote");
    togglePopoverVisibility();
    toggleModalVisibility();
  }, [toggleModalVisibility, togglePopoverVisibility]);

  const onCancel = useCallback(() => {
    setMode(null);
    toggleModalVisibility();
  }, [toggleModalVisibility]);

  // TODO (marcushaddon): accept promote/demote callbacks, canPromo as props
  const onSubmit = useCallback(
    async (input) => {
      try {
        if (mode === "promote") {
          await promoteModerator({ userID: user.id, siteIDs: input.siteIDs });
        } else if (mode === "demote") {
          await demoteModerator({ userID: user.id, siteIDs: input.siteIDs });
        }

        setMode(null);
        toggleModalVisibility();

        return;
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return { [FORM_ERROR]: err.message };
      }
    },
    [demoteModerator, mode, promoteModerator, toggleModalVisibility, user.id]
  );

  const viewerSites = viewer.moderationScopes?.sites || [];
  const userSites = user.moderationScopes?.sites || [];

  // These are sites that only the viewer has and the user does not.
  const uniqueViewerSites = viewerSites.filter(
    (s) => !userSites.find(({ id }) => s.id === id)
  );

  // If the user is a site moderator and some of the sites on the user are the
  // same as the sites on the viewer, then we can demote this user.
  const canDemoteModerator =
    user.role === GQLUSER_ROLE.MODERATOR &&
    !!user.moderationScopes?.scoped &&
    userSites.some((s) => viewerSites.find(({ id }) => s.id === id));

  // If the user is a site moderator, staff, or commenter and some of the sites
  // on the viewer are not on the user, then we can promote this user.
  const canPromoteModerator =
    ((user.role === GQLUSER_ROLE.MODERATOR &&
      !!user.moderationScopes?.scoped) ||
      user.role === GQLUSER_ROLE.STAFF ||
      user.role === GQLUSER_ROLE.MEMBER ||
      user.role === GQLUSER_ROLE.COMMENTER) &&
    uniqueViewerSites.length > 0;

  const canPerformActions = canPromoteModerator || canDemoteModerator;

  if (!canPerformActions) {
    return (
      <UserRoleText
        moderationScopesEnabled
        scoped={!!user.moderationScopes?.scoped}
        role={user.role}
      />
    );
  }

  return (
    <>
      {/* SiteRoleActionsModal! */}
      <SiteRoleActionsModal
        open={isModalVisible}
        mode={mode}
        user={user}
        viewer={viewer}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
      <Localized
        id="community-siteRoleActions-popover"
        attrs={{ description: true }}
      >
        <Popover
          id="community-siteRoleActions"
          placement="bottom-start"
          description="A dropdown to promote/demote a user to/from sites"
          visible={isPopoverVisible}
          body={
            <ClickOutside onClickOutside={togglePopoverVisibility}>
              <Dropdown>
                {canPromoteModerator &&
                  (user.role === GQLUSER_ROLE.MODERATOR ? (
                    <Localized id="community-assignMySites">
                      <DropdownButton onClick={onPromote}>
                        Assign my sites
                      </DropdownButton>
                    </Localized>
                  ) : (
                    <UserRoleChangeButton
                      role={GQLUSER_ROLE.MODERATOR}
                      scoped
                      moderationScopesEnabled
                      onClick={onPromote}
                    />
                  ))}
                {canDemoteModerator && (
                  <Localized id="community-removeMySites">
                    <DropdownButton onClick={onDemote}>
                      Remove my sites
                    </DropdownButton>
                  </Localized>
                )}
              </Dropdown>
            </ClickOutside>
          }
        >
          {({ ref }) => (
            <Localized
              id="community-changeRoleButton"
              attrs={{ "aria-label": true }}
            >
              <Button
                aria-label="Change role"
                className={styles.button}
                onClick={togglePopoverVisibility}
                uppercase={false}
                size="large"
                color="mono"
                ref={ref}
                variant="text"
              >
                <UserRoleText
                  moderationScopesEnabled
                  scoped={!!user.moderationScopes?.scoped}
                  role={user.role}
                />
                <ButtonIcon size="lg">
                  {isPopoverVisible ? "arrow_drop_up" : "arrow_drop_down"}
                </ButtonIcon>
              </Button>
            </Localized>
          )}
        </Popover>
      </Localized>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment SiteRoleActions_viewer on User {
      id
      moderationScopes {
        sites {
          id
          name
        }
      }
      ...SiteRoleActionsModal_viewer
    }
  `,
  user: graphql`
    fragment SiteRoleActions_user on User {
      id
      username
      role
      membershipScopes {
        sites {
          id
          name
        }
      }
      moderationScopes {
        scoped
        sites {
          id
          name
        }
      }
      ...SiteRoleActionsModal_user
    }
  `,
})(SiteRoleActions);

export default enhanced;
