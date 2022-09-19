import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import {
  isSiteModerationScoped,
  validatePermissionsAction,
} from "coral-common/permissions";
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

import DemoteMemberMutation from "./DemoteMemberMutation";
import DemoteModeratorMutation from "./DemoteModeratorMutation";
import MemberActionsModal from "./MemberActionsModal";
import PromoteMemberMutation from "./PromoteMemberMutation";
import PromoteModeratorMutation from "./PromoteModeratorMutation";
import SiteModeratorActionsModal from "./SiteModeratorActionsModal";
import UserRoleChangeButton from "./UserRoleChangeButton";
import UserRoleText from "./UserRoleText";

import styles from "./SiteRoleActions.css";
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

  const [mode, setMode] = useState<"promote" | "demote" | null>(null);
  const [isModalVisible, , toggleModalVisibility] = useToggleState();
  const [
    isPopoverVisible,
    setIsPopoverVisible,
    togglePopoverVisibility,
  ] = useToggleState();

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

  const startPromoting = useCallback(
    (roleType: SiteRoleType) => {
      setSiteRoleType(roleType);
      setMode("promote");
      togglePopoverVisibility();
      toggleModalVisibility();
    },
    [toggleModalVisibility, togglePopoverVisibility, setSiteRoleType]
  );

  const startDemoting = useCallback(
    (roleType: SiteRoleType) => {
      setSiteRoleType(roleType);
      setMode("demote");
      togglePopoverVisibility();
      toggleModalVisibility();
    },
    [toggleModalVisibility, togglePopoverVisibility, setSiteRoleType]
  );

  const onCancel = useCallback(() => {
    setMode(null);
    toggleModalVisibility();
  }, [toggleModalVisibility]);

  const onSubmit = useCallback(
    (promoter: SiteRoleScopeChange, demoter: SiteRoleScopeChange) => async (
      input: any
    ) => {
      try {
        if (mode === "promote") {
          await promoter({ userID: user.id, siteIDs: input.siteIDs });
        } else if (mode === "demote") {
          await demoter({ userID: user.id, siteIDs: input.siteIDs });
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
    [mode, toggleModalVisibility, user.id]
  );

  const canChangeToCommenter = validatePermissionsAction({
    viewer,
    user,
    newUserRole: GQLUSER_ROLE.COMMENTER,
  });

  // These are sites that only the viewer can moderate, and not the user.
  const uniqueViewerModerationSites = viewerSites.filter(
    (s) => !userModerationSites.find(({ id }) => s.id === id)
  );

  const membershipSitesToGive = viewerSites.filter(
    (s) => !userMembershipSites.find(({ id }) => id === s.id)
  );

  const canPromoteToMember = validatePermissionsAction({
    viewer,
    user,
    newUserRole: GQLUSER_ROLE.MEMBER,
    scopeAdditions: membershipSitesToGive.map(({ id }) => id),
  });

  const canPromoteToModerator = validatePermissionsAction({
    viewer,
    user,
    newUserRole: GQLUSER_ROLE.MODERATOR,
    scopeAdditions: uniqueViewerModerationSites.map(({ id }) => id),
  });

  // If the user is a site moderator and some of the sites on the user are the
  // same as the sites on the viewer, then we can demote this user.
  const canDemoteModerator =
    user.role === GQLUSER_ROLE.MODERATOR &&
    !!user.moderationScopes?.scoped &&
    (userModerationSites.some((s) =>
      viewerSites.find(({ id }) => s.id === id)
    ) ||
      !isSiteModerationScoped(viewer.moderationScopes));

  // If the user is a site moderator, staff, or commenter and some of the sites
  // on the viewer are not on the user, then we can promote this user.
  const canPromoteModerator =
    user.role === GQLUSER_ROLE.MODERATOR &&
    !!user.moderationScopes?.scoped &&
    uniqueViewerModerationSites.length > 0;

  const canPromoteMember =
    user.role === GQLUSER_ROLE.MEMBER && membershipSitesToGive.length > 0;
  const canDemoteMember =
    user.role === GQLUSER_ROLE.MEMBER &&
    userMembershipSites.some((s) => viewerSites.find(({ id }) => id === s.id));

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
      {mode !== null && siteRoleType === SiteRoleType.MODERATOR && (
        <SiteModeratorActionsModal
          open={isModalVisible}
          mode={mode}
          username={user.username}
          siteRoleScopes={user.moderationScopes}
          viewer={viewer}
          onSubmit={onSubmit(promoteModerator, demoteModerator)}
          onCancel={onCancel}
        />
      )}
      {mode !== null && siteRoleType === SiteRoleType.MEMBER && (
        <MemberActionsModal
          open={isModalVisible}
          mode={mode}
          username={user.username}
          siteRoleScopes={user.membershipScopes}
          viewer={viewer}
          onSubmit={onSubmit(promoteMember, demoteMember)}
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
                {canPromoteToModerator && (
                  <UserRoleChangeButton
                    role={GQLUSER_ROLE.MODERATOR}
                    scoped
                    moderationScopesEnabled
                    onClick={() => startPromoting(SiteRoleType.MODERATOR)}
                  />
                )}
                {canPromoteModerator && (
                  <Localized id="community-assignMySitesToModerator">
                    <DropdownButton
                      onClick={() => startPromoting(SiteRoleType.MODERATOR)}
                    >
                      Assign moderator to my sites
                    </DropdownButton>
                  </Localized>
                )}
                {canDemoteModerator && (
                  <Localized id="community-removeMySitesFromModerator">
                    <DropdownButton
                      onClick={() => startDemoting(SiteRoleType.MODERATOR)}
                    >
                      Remove moderator from my sites
                    </DropdownButton>
                  </Localized>
                )}
                {canPromoteToMember && (
                  <UserRoleChangeButton
                    role={GQLUSER_ROLE.MEMBER}
                    scoped
                    moderationScopesEnabled
                    onClick={() => startPromoting(SiteRoleType.MEMBER)}
                  />
                )}
                {canPromoteMember && (
                  <Localized id="community-assignMySitesToMember">
                    <DropdownButton
                      onClick={() => startPromoting(SiteRoleType.MEMBER)}
                    >
                      Assign member to my sites
                    </DropdownButton>
                  </Localized>
                )}
                {canDemoteMember && (
                  <Localized id="community-removeMySitesFromMember">
                    <DropdownButton
                      onClick={() => startDemoting(SiteRoleType.MEMBER)}
                    >
                      Remove member from my sites
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
