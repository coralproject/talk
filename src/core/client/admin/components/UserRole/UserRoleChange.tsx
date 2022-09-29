import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";

import { validateRoleChange } from "coral-common/permissions";
import { useToggleState } from "coral-framework/hooks";
import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  Popover,
} from "coral-ui/components/v2";

import { UserRoleChangeContainer_user } from "coral-admin/__generated__/UserRoleChangeContainer_user.graphql";
import { UserRoleChangeContainer_viewer } from "coral-admin/__generated__/UserRoleChangeContainer_viewer.graphql";

import SiteRoleModal from "./SiteRoleModal";
import UserRoleChangeButton from "./UserRoleChangeButton";
import UserRoleText from "./UserRoleText";

import styles from "./UserRoleChange.css";

interface Props {
  user: UserRoleChangeContainer_user;
  onChangeRole: (role: GQLUSER_ROLE_RL, siteIDs?: string[]) => Promise<void>;
  onChangeModerationScopes: (siteIDs: string[]) => Promise<void>;
  onChangeMembershipScopes: (siteIDs: string[]) => Promise<void>;
  moderationScopesEnabled?: boolean;
  viewer: UserRoleChangeContainer_viewer;
}

const UserRoleChange: FunctionComponent<Props> = ({
  user,
  onChangeRole,
  onChangeModerationScopes,
  onChangeMembershipScopes,
  moderationScopesEnabled = false,
  viewer,
}) => {
  const isAllowed = useCallback(
    (newRole: GQLUSER_ROLE_RL, siteScoped = false) => {
      const viewerUser = {
        ...viewer,
        moderationScopes: {
          siteIDs: viewer.moderationScopes?.sites?.map(({ id }) => id) || [],
        },
      };

      return validateRoleChange(viewerUser, user, newRole, siteScoped);
    },
    [viewer, user]
  );
  // Setup state and callbacks for the popover.
  const [isPopoverVisible, setPopoverVisibility, togglePopoverVisibility] =
    useToggleState();

  /**
   * handleChangeRole combines the change role function with the change
   * moderation scopes.
   */
  const handleChangeRole = useCallback(
    async (r: GQLUSER_ROLE_RL, siteIDs: string[] = []) => {
      await onChangeRole(r, siteIDs);
    },
    [onChangeRole]
  );
  const onClick = useCallback(
    (r: GQLUSER_ROLE_RL, siteIDs: string[] = []) =>
      async () => {
        await handleChangeRole(r, siteIDs);
        togglePopoverVisibility();
      },
    [handleChangeRole, togglePopoverVisibility]
  );

  const [siteRole, setSiteRole] = useState<GQLUSER_ROLE | null>(null);

  const moderationScoped = !!user.moderationScopes?.scoped;
  const membershipScoped = !!user.moderationScopes?.scoped;

  const onFinishModal = useCallback(
    async (siteIDs: string[]) => {
      if (siteRole !== user.role) {
        await handleChangeRole(siteRole!, siteIDs);
      } else {
        if (siteRole === GQLUSER_ROLE.MODERATOR) {
          await onChangeModerationScopes(siteIDs);
        } else {
          await onChangeMembershipScopes(siteIDs);
        }
      }

      setSiteRole(null);
    },
    [
      siteRole,
      handleChangeRole,
      onChangeMembershipScopes,
      onChangeModerationScopes,
      user.role,
    ]
  );

  const selectedModerationSiteIDs = useMemo(
    () => user.moderationScopes?.sites?.map((site) => site.id),
    [user.moderationScopes]
  );

  const selectedMembershipSiteIDs = useMemo(
    () => user.membershipScopes?.sites?.map((site) => site.id),
    [user.membershipScopes]
  );

  const showSiteRoleModal = !!siteRole;
  const siteRoleSiteIDs =
    siteRole === GQLUSER_ROLE.MODERATOR
      ? selectedModerationSiteIDs
      : siteRole === GQLUSER_ROLE.MEMBER
      ? selectedMembershipSiteIDs
      : [];

  return (
    <>
      <SiteRoleModal
        roleToBeSet={siteRole}
        username={user.username}
        open={showSiteRoleModal}
        selectedSiteIDs={siteRoleSiteIDs}
        onCancel={() => setSiteRole(null)}
        onFinish={(siteIDs: string[]) => onFinishModal(siteIDs)}
      />
      <Localized id="community-role-popover" attrs={{ description: true }}>
        <Popover
          id="community-roleChange"
          placement="bottom-start"
          description="A dropdown to change the user role"
          visible={isPopoverVisible}
          body={
            <ClickOutside onClickOutside={togglePopoverVisibility}>
              <Dropdown>
                {isAllowed(GQLUSER_ROLE.COMMENTER) && (
                  <UserRoleChangeButton
                    active={user.role === GQLUSER_ROLE.COMMENTER}
                    role={GQLUSER_ROLE.COMMENTER}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.COMMENTER)}
                  />
                )}
                {isAllowed(GQLUSER_ROLE.MEMBER) && (
                  <UserRoleChangeButton
                    active={
                      membershipScoped && user.role === GQLUSER_ROLE.MEMBER
                    }
                    role={GQLUSER_ROLE.MEMBER}
                    moderationScopesEnabled={moderationScopesEnabled}
                    scoped
                    onClick={() => {
                      setSiteRole(GQLUSER_ROLE.MEMBER);
                      setPopoverVisibility(false);
                    }}
                  />
                )}
                {isAllowed(GQLUSER_ROLE.STAFF) && (
                  <UserRoleChangeButton
                    active={user.role === GQLUSER_ROLE.STAFF}
                    role={GQLUSER_ROLE.STAFF}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.STAFF)}
                  />
                )}
                {moderationScopesEnabled &&
                  isAllowed(GQLUSER_ROLE.MODERATOR, true) && (
                    <UserRoleChangeButton
                      active={
                        moderationScoped && user.role === GQLUSER_ROLE.MODERATOR
                      }
                      role={GQLUSER_ROLE.MODERATOR}
                      scoped
                      moderationScopesEnabled
                      onClick={() => {
                        setSiteRole(GQLUSER_ROLE.MODERATOR);
                        setPopoverVisibility(false);
                      }}
                    />
                  )}
                {isAllowed(GQLUSER_ROLE.MODERATOR) && (
                  <UserRoleChangeButton
                    active={
                      (!moderationScopesEnabled ||
                        (moderationScopesEnabled && !moderationScoped)) &&
                      user.role === GQLUSER_ROLE.MODERATOR
                    }
                    role={GQLUSER_ROLE.MODERATOR}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.MODERATOR)}
                  />
                )}
                {isAllowed(GQLUSER_ROLE.ADMIN) && (
                  <UserRoleChangeButton
                    active={user.role === GQLUSER_ROLE.ADMIN}
                    role={GQLUSER_ROLE.ADMIN}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.ADMIN)}
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
                  moderationScopesEnabled={moderationScopesEnabled}
                  scoped={moderationScoped || membershipScoped}
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

export default UserRoleChange;
