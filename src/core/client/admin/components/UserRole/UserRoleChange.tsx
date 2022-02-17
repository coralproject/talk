import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";

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

import SiteRoleModal from "./SiteRoleModal";
import UserRoleChangeButton from "./UserRoleChangeButton";
import UserRoleText from "./UserRoleText";

import styles from "./UserRoleChange.css";

interface Props {
  username: string | null;
  onChangeRole: (role: GQLUSER_ROLE_RL) => Promise<void>;
  onChangeModerationScopes: (siteIDs: string[]) => Promise<void>;
  onChangeMembershipScopes: (siteIDs: string[]) => Promise<void>;
  role: GQLUSER_ROLE_RL;
  scoped?: boolean;
  moderationScopes: UserRoleChangeContainer_user["moderationScopes"];
  membershipScopes: UserRoleChangeContainer_user["membershipScopes"];
  moderationScopesEnabled?: boolean;
}

const UserRoleChange: FunctionComponent<Props> = ({
  username,
  role,
  scoped,
  onChangeRole,
  onChangeModerationScopes,
  moderationScopes,
  onChangeMembershipScopes,
  membershipScopes,
  moderationScopesEnabled = false,
}) => {
  // Setup state and callbacks for the popover.
  const [
    isPopoverVisible,
    setPopoverVisibility,
    togglePopoverVisibility,
  ] = useToggleState();

  /**
   * handleChangeRole combines the change role function with the change
   * moderation scopes.
   */
  const handleChangeRole = useCallback(
    async (r: GQLUSER_ROLE_RL, siteIDs: string[] = []) => {
      await onChangeRole(r);

      if (r === GQLUSER_ROLE.MEMBER) {
        await onChangeMembershipScopes(siteIDs);
      } else if (r === GQLUSER_ROLE.MODERATOR && moderationScopesEnabled) {
        await onChangeModerationScopes(siteIDs);
      }
    },
    [
      onChangeMembershipScopes,
      onChangeRole,
      onChangeModerationScopes,
      moderationScopesEnabled,
    ]
  );
  const onClick = useCallback(
    (r: GQLUSER_ROLE_RL, siteIDs: string[] = []) => async () => {
      await handleChangeRole(r, siteIDs);
      togglePopoverVisibility();
    },
    [handleChangeRole, togglePopoverVisibility]
  );

  const [siteRole, setSiteRole] = useState<GQLUSER_ROLE | null>(null);

  const onFinishModal = useCallback(
    async (siteIDs: string[]) => {
      // Set the user as new role and then update the siteIDs.
      await handleChangeRole(siteRole!, siteIDs);

      setSiteRole(null);
    },
    [siteRole, handleChangeRole]
  );

  const selectedModerationSiteIDs = useMemo(
    () => moderationScopes?.sites?.map((site) => site.id),
    [moderationScopes]
  );

  const selectedMembershipSiteIDs = useMemo(
    () => membershipScopes?.sites?.map((site) => site.id),
    [membershipScopes]
  );

  const showSiteRoleModal = !!siteRole;
  const siteRoleSitIDs =
    siteRole === GQLUSER_ROLE.MODERATOR
      ? selectedModerationSiteIDs
      : siteRole === GQLUSER_ROLE.MEMBER
      ? selectedMembershipSiteIDs
      : [];

  return (
    <>
      <SiteRoleModal
        username={username}
        open={showSiteRoleModal}
        selectedSiteIDs={siteRoleSitIDs}
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
                <UserRoleChangeButton
                  active={role === GQLUSER_ROLE.COMMENTER}
                  role={GQLUSER_ROLE.COMMENTER}
                  moderationScopesEnabled={moderationScopesEnabled}
                  onClick={onClick(GQLUSER_ROLE.COMMENTER)}
                />
                <UserRoleChangeButton
                  active={role === GQLUSER_ROLE.MEMBER}
                  role={GQLUSER_ROLE.MEMBER}
                  moderationScopesEnabled={moderationScopesEnabled}
                  scoped
                  onClick={() => {
                    setSiteRole(GQLUSER_ROLE.MEMBER);
                    setPopoverVisibility(false);
                  }}
                />
                <UserRoleChangeButton
                  active={role === GQLUSER_ROLE.STAFF}
                  role={GQLUSER_ROLE.STAFF}
                  moderationScopesEnabled={moderationScopesEnabled}
                  onClick={onClick(GQLUSER_ROLE.STAFF)}
                />
                {moderationScopesEnabled && (
                  <UserRoleChangeButton
                    active={scoped && role === GQLUSER_ROLE.MODERATOR}
                    role={GQLUSER_ROLE.MODERATOR}
                    scoped
                    moderationScopesEnabled
                    onClick={() => {
                      setSiteRole(GQLUSER_ROLE.MODERATOR);
                      setPopoverVisibility(false);
                    }}
                  />
                )}
                <UserRoleChangeButton
                  active={
                    (!moderationScopesEnabled ||
                      (moderationScopesEnabled && !scoped)) &&
                    role === GQLUSER_ROLE.MODERATOR
                  }
                  role={GQLUSER_ROLE.MODERATOR}
                  moderationScopesEnabled={moderationScopesEnabled}
                  onClick={onClick(GQLUSER_ROLE.MODERATOR)}
                />
                <UserRoleChangeButton
                  active={role === GQLUSER_ROLE.ADMIN}
                  role={GQLUSER_ROLE.ADMIN}
                  moderationScopesEnabled={moderationScopesEnabled}
                  onClick={onClick(GQLUSER_ROLE.ADMIN)}
                />
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
                  scoped={scoped}
                  role={role}
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
