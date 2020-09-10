import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useMemo } from "react";

import { useToggleState } from "coral-framework/hooks";
import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  Popover,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import { UserRoleChangeContainer_user } from "coral-admin/__generated__/UserRoleChangeContainer_user.graphql";

import SiteModeratorModal from "./SiteModeratorModal";
import UserRoleChangeButton from "./UserRoleChangeButton";
import UserRoleText from "./UserRoleText";

import styles from "./UserRoleChange.css";

interface Props {
  username: string | null;
  onChangeRole: (role: GQLUSER_ROLE_RL) => Promise<void>;
  onChangeModerationScopes: (siteIDs: string[]) => Promise<void>;
  role: GQLUSER_ROLE_RL;
  scoped?: boolean;
  moderationScopes: UserRoleChangeContainer_user["moderationScopes"];
  moderationScopesEnabled?: boolean;
  query: PropTypesOf<typeof SiteModeratorModal>["query"];
  viewerRole: GQLUSER_ROLE_RL;
  viewerScoped: boolean;
  viewerSites?: string[] | null;
}

const UserRoleChange: FunctionComponent<Props> = ({
  username,
  role,
  scoped,
  onChangeRole,
  onChangeModerationScopes,
  moderationScopes,
  moderationScopesEnabled = false,
  query,
  viewerRole,
  viewerScoped,
  viewerSites,
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

      if (moderationScopesEnabled) {
        await onChangeModerationScopes(siteIDs);
      }
    },
    [onChangeRole, onChangeModerationScopes, moderationScopesEnabled]
  );
  const onClick = useCallback(
    (r: GQLUSER_ROLE_RL, siteIDs: string[] = []) => async () => {
      await handleChangeRole(r, siteIDs);
      togglePopoverVisibility();
    },
    [handleChangeRole, togglePopoverVisibility]
  );

  // Setup state and callbacks for the site moderator modal.
  const [
    isModalVisible,
    setModalVisibility,
    toggleModalVisibility,
  ] = useToggleState();
  const onFinishModal = useCallback(
    async (siteIDs: string[]) => {
      // Set the user as a moderator and then update the siteIDs.
      await handleChangeRole(GQLUSER_ROLE.MODERATOR, siteIDs);

      // Close the modal.
      setModalVisibility(false);
    },
    [setModalVisibility, handleChangeRole]
  );

  const selectedSiteIDs = useMemo(
    () => moderationScopes?.sites?.map((site) => site.id),
    [moderationScopes]
  );

  function canChangeRole(targetRole: GQLUSER_ROLE_RL, unscoped = false) {
    if (viewerRole === GQLUSER_ROLE.ADMIN) {
      return true;
    }
    if (
      role !== GQLUSER_ROLE.ADMIN &&
      targetRole === GQLUSER_ROLE.MODERATOR &&
      (!unscoped || !viewerScoped)
    ) {
      return true;
    }
    return false;
  }

  return (
    <>
      {moderationScopesEnabled && (
        <SiteModeratorModal
          username={username}
          open={isModalVisible}
          query={query}
          selectedSiteIDs={selectedSiteIDs}
          onCancel={toggleModalVisibility}
          onFinish={onFinishModal}
          viewerScoped={viewerScoped}
          viewerSites={viewerSites}
        />
      )}
      <Localized id="community-role-popover" attrs={{ description: true }}>
        <Popover
          id="community-roleChange"
          placement="bottom-start"
          description="A dropdown to change the user role"
          visible={isPopoverVisible}
          body={
            <ClickOutside onClickOutside={togglePopoverVisibility}>
              <Dropdown>
                {canChangeRole(GQLUSER_ROLE.COMMENTER) && (
                  <UserRoleChangeButton
                    active={role === GQLUSER_ROLE.COMMENTER}
                    role={GQLUSER_ROLE.COMMENTER}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.COMMENTER)}
                  />
                )}
                {canChangeRole(GQLUSER_ROLE.STAFF) && (
                  <UserRoleChangeButton
                    active={role === GQLUSER_ROLE.STAFF}
                    role={GQLUSER_ROLE.STAFF}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.STAFF)}
                  />
                )}
                {moderationScopesEnabled &&
                  canChangeRole(GQLUSER_ROLE.MODERATOR) && (
                    <UserRoleChangeButton
                      active={scoped && role === GQLUSER_ROLE.MODERATOR}
                      role={GQLUSER_ROLE.MODERATOR}
                      scoped
                      moderationScopesEnabled
                      onClick={() => {
                        setModalVisibility(true);
                        setPopoverVisibility(false);
                      }}
                    />
                  )}
                {canChangeRole(GQLUSER_ROLE.MODERATOR, true) && (
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
                )}
                {canChangeRole(GQLUSER_ROLE.ADMIN) && (
                  <UserRoleChangeButton
                    active={role === GQLUSER_ROLE.ADMIN}
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
