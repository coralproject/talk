import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { validatePermissionsAction } from "coral-common/permissions";
import { useToggleState } from "coral-framework/hooks";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  Popover,
} from "coral-ui/components/v2";

import { SiteRoleActions_user } from "coral-admin/__generated__/SiteRoleActions_user.graphql";
import { SiteRoleActions_viewer } from "coral-admin/__generated__/SiteRoleActions_viewer.graphql";

import SiteModeratorActionsModal from "./SiteModeratorActionsModal";
import UserRoleChangeButton from "./UserRoleChangeButton";
import UserRoleText from "./UserRoleText";

import styles from "./SiteRoleActions.css";

import DemoteMemberMutation from "./DemoteMemberMutation";
import DemoteModeratorMutation from "./DemoteModeratorMutation";
import PromoteMemberMutation from "./PromoteMemberMutation";
import PromoteModeratorMutation from "./PromoteModeratorMutation";
import UpdateUserRoleMutation from "./UpdateUserRoleMutation";

interface Props {
  viewer: SiteRoleActions_viewer;
  user: SiteRoleActions_user;
}

enum SiteRoleType {
  MODERATOR,
  MEMBER,
}

type SiteRoleScopeChange = (change: {
  userID: string;
  siteIDs: string[];
}) => Promise<any>;

const SiteRoleActions: FunctionComponent<Props> = ({ viewer, user }) => {
  const changeRole = useMutation(UpdateUserRoleMutation);
  const promoteModerator = useMutation(PromoteModeratorMutation);
  const demoteModerator = useMutation(DemoteModeratorMutation);
  const promoteMember = useMutation(PromoteMemberMutation);
  const demoteMember = useMutation(DemoteMemberMutation);

  const addModerationScopes: SiteRoleScopeChange = useCallback(
    async ({ userID, siteIDs }) => {
      await promoteModerator({
        userID,
        siteIDs,
      });
    },
    [promoteModerator]
  );

  const removeModerationScopes: SiteRoleScopeChange = useCallback(
    async ({ userID, siteIDs }) => {
      await demoteModerator({
        userID,
        siteIDs,
      });
    },
    [demoteModerator]
  );

  const addMembershipScopes: SiteRoleScopeChange = useCallback(
    async ({ userID, siteIDs }) => {
      await promoteMember({
        userID,
        siteIDs,
      });
    },
    [promoteMember]
  );

  const removeMembershipScopes: SiteRoleScopeChange = useCallback(
    async ({ userID, siteIDs }) => {
      await demoteMember({
        userID,
        siteIDs,
      });
    },
    [demoteMember]
  );

  const [isModalVisible, , toggleModalVisibility] = useToggleState();
  const [isPopoverVisible, setIsPopoverVisible, togglePopoverVisibility] =
    useToggleState();

  const viewerSites = viewer.moderationScopes?.sites || [];
  const userModerationSites = user.moderationScopes?.sites || [];
  const userMembershipSites = user.membershipScopes?.sites || [];
  const [siteRoleType, setSiteRoleType] = useState<SiteRoleType>(
    SiteRoleType.MODERATOR
  );

  const changeToCommenter = useCallback(async () => {
    await changeRole({
      userID: user.id,
      role: GQLUSER_ROLE.COMMENTER,
    });

    setIsPopoverVisible(false);
  }, [user, changeRole, setIsPopoverVisible]);

  const startManagingSiteRole = useCallback(
    (roleType: SiteRoleType) => {
      setSiteRoleType(roleType);
      togglePopoverVisibility();
      toggleModalVisibility();
    },
    [toggleModalVisibility, togglePopoverVisibility, setSiteRoleType]
  );

  const onCancel = useCallback(() => {
    toggleModalVisibility();
  }, [toggleModalVisibility]);

  const onSubmit = useCallback(
    (promoter: SiteRoleScopeChange, demoter: SiteRoleScopeChange) =>
      async (input: any) => {
        try {
          if (input.scopeAdditions.length) {
            await promoter({ userID: user.id, siteIDs: input.scopeAdditions });
          }

          if (input.scopeDeletions.length) {
            await demoter({ userID: user.id, siteIDs: input.scopeDeletions });
          }

          toggleModalVisibility();

          return;
        } catch (err) {
          if (err instanceof InvalidRequestError) {
            return err.invalidArgs;
          }
          return { [FORM_ERROR]: err.message };
        }
      },
    [toggleModalVisibility, user]
  );

  // BOOKMARKUS: how is this true here but false in UserRoleChange for org mod?
  const canChangeToCommenter = validatePermissionsAction({
    viewer,
    user,
    newUserRole: GQLUSER_ROLE.COMMENTER,
  });

  // These are sites that only the viewer can moderate, and not the user.
  const moderationSitesToGive = viewerSites
    .filter((s) => !userModerationSites.find(({ id }) => s.id === id))
    .map(({ id }) => id);

  const moderationSitesToRemove = viewerSites
    .filter((s) => userModerationSites.find(({ id }) => s.id === id))
    .map(({ id }) => id);

  const membershipSitesToGive = viewerSites
    .filter((s) => !userMembershipSites.find(({ id }) => id === s.id))
    .map(({ id }) => id);

  const membershipSitesToRemove = viewerSites
    .filter((s) => userMembershipSites.find(({ id }) => id === s.id))
    .map(({ id }) => id);

  const canPromoteToMember = validatePermissionsAction({
    viewer,
    user,
    newUserRole: GQLUSER_ROLE.MEMBER,
    scopeAdditions: membershipSitesToGive,
  });

  const canPromoteToModerator = validatePermissionsAction({
    viewer,
    user,
    newUserRole: GQLUSER_ROLE.MODERATOR,
    scopeAdditions: moderationSitesToGive,
  });

  // If the user is a site moderator and some of the sites on the user are the
  // same as the sites on the viewer, then we can demote this user.
  const canDemoteModerator =
    !!moderationSitesToRemove.length &&
    validatePermissionsAction({
      viewer,
      user,
      newUserRole: GQLUSER_ROLE.MODERATOR,
      scopeDeletions: moderationSitesToRemove,
    });

  // If the user is a site moderator, staff, or commenter and some of the sites
  // on the viewer are not on the user, then we can promote this user.
  const canPromoteModerator =
    !!moderationSitesToGive.length &&
    validatePermissionsAction({
      viewer,
      user,
      newUserRole: GQLUSER_ROLE.MODERATOR,
      scopeAdditions: moderationSitesToGive,
    });

  const canPromoteMember =
    !!membershipSitesToGive.length &&
    validatePermissionsAction({
      viewer,
      user,
      newUserRole: GQLUSER_ROLE.MEMBER,
      scopeAdditions: membershipSitesToGive,
    });
  const canDemoteMember =
    !!membershipSitesToRemove.length &&
    validatePermissionsAction({
      viewer,
      user,
      newUserRole: GQLUSER_ROLE.MEMBER,
      scopeDeletions: membershipSitesToRemove,
    });

  const canPerformActions =
    canPromoteToModerator ||
    canPromoteToMember ||
    canPromoteModerator ||
    canDemoteModerator ||
    canPromoteMember ||
    canDemoteMember;

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
      <SiteModeratorActionsModal
        open={isModalVisible}
        username={user.username}
        siteRoleScopes={user.moderationScopes}
        viewer={viewer}
        onSubmit={onSubmit(addModerationScopes, removeModerationScopes)}
        onCancel={onCancel}
      />
      {siteRoleType === SiteRoleType.MEMBER && (
        <SiteModeratorActionsModal
          open={isModalVisible}
          username={user.username}
          siteRoleScopes={user.membershipScopes}
          viewer={viewer}
          onSubmit={onSubmit(addMembershipScopes, removeMembershipScopes)}
          onCancel={onCancel}
        />
      )}
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
                {canChangeToCommenter && (
                  <UserRoleChangeButton
                    role={GQLUSER_ROLE.COMMENTER}
                    onClick={changeToCommenter}
                    moderationScopesEnabled
                  />
                )}
                {canPromoteToMember && (
                  <UserRoleChangeButton
                    role={GQLUSER_ROLE.MEMBER}
                    scoped
                    moderationScopesEnabled
                    onClick={() => startManagingSiteRole(SiteRoleType.MEMBER)}
                  />
                )}
                {canPromoteToModerator && (
                  <UserRoleChangeButton
                    role={GQLUSER_ROLE.MODERATOR}
                    scoped
                    moderationScopesEnabled
                    onClick={() =>
                      startManagingSiteRole(SiteRoleType.MODERATOR)
                    }
                  />
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
      role
      moderationScopes {
        siteIDs
        sites {
          id
          name
        }
      }
    }
  `,
  user: graphql`
    fragment SiteRoleActions_user on User {
      id
      username
      role
      membershipScopes {
        scoped
        siteIDs
        sites {
          id
          name
        }
      }
      moderationScopes {
        scoped
        siteIDs
        sites {
          id
          name
        }
      }
    }
  `,
})(SiteRoleActions);

export default enhanced;
