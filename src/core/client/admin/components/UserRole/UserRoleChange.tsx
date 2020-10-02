import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useMemo } from "react";

import { useToggleState } from "coral-framework/hooks";
import { GQLUSER_ROLE } from "coral-framework/schema";
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
  onChange: (role: GQLUSER_ROLE, siteIDs?: string[]) => Promise<void>;
  onPromote: () => Promise<void>;
  role: GQLUSER_ROLE;
  scoped?: boolean;
  moderationScopes: UserRoleChangeContainer_user["moderationScopes"];
  moderationScopesEnabled?: boolean;
  query: PropTypesOf<typeof SiteModeratorModal>["query"];
  viewerRole: GQLUSER_ROLE;
  viewerScoped: boolean;
  viewerSites?: string[] | null;
}

export interface RoleDescription {
  role: GQLUSER_ROLE;
  scoped: boolean | undefined;
}

export function canChangeRole(
  viewerRole: RoleDescription,
  existingRole: RoleDescription,
  newRole: RoleDescription
) {
  // admin's can do whatever they want
  if (viewerRole.role === GQLUSER_ROLE.ADMIN) {
    return true;
  }

  // staff and commenters can't do anything
  if ([GQLUSER_ROLE.STAFF, GQLUSER_ROLE.COMMENTER].includes(viewerRole.role)) {
    return false;
  }

  // organization moderators
  if (viewerRole.role === GQLUSER_ROLE.MODERATOR && !viewerRole.scoped) {
    // can only update commenters, staff, and site mods
    if (
      existingRole.role === GQLUSER_ROLE.ADMIN ||
      (existingRole.role === GQLUSER_ROLE.MODERATOR && !existingRole.scoped)
    ) {
      return false;
    }

    // cannot upgrade to admin
    if (newRole.role === GQLUSER_ROLE.ADMIN) {
      return false;
    }

    return true;
  }

  // site moderator
  if (viewerRole.role === GQLUSER_ROLE.MODERATOR && viewerRole.scoped) {
    // can only update staff and commenters
    if (
      ![GQLUSER_ROLE.STAFF, GQLUSER_ROLE.COMMENTER].includes(existingRole.role)
    ) {
      return false;
    }

    // can only update if the new role is to a site mod
    if (newRole.role !== GQLUSER_ROLE.MODERATOR || !newRole.scoped) {
      return false;
    }

    return true;
  }

  return false;
}

const UserRoleChange: FunctionComponent<Props> = ({
  username,
  role,
  scoped,
  onChange,
  onPromote,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPopoverVisibility,
    togglePopoverVisibility,
  ] = useToggleState();

  const canChangeCommenter = useMemo(
    () =>
      canChangeRole(
        { role: viewerRole, scoped: viewerScoped },
        { role, scoped },
        {
          role: GQLUSER_ROLE.COMMENTER,
          scoped: false,
        }
      ),
    [role, scoped, viewerRole, viewerScoped]
  );
  const canChangeStaff = useMemo(
    () =>
      canChangeRole(
        { role: viewerRole, scoped: viewerScoped },
        { role, scoped },
        {
          role: GQLUSER_ROLE.STAFF,
          scoped: false,
        }
      ),
    [role, scoped, viewerRole, viewerScoped]
  );
  const canChangeSiteMod = useMemo(
    () =>
      moderationScopesEnabled &&
      canChangeRole(
        { role: viewerRole, scoped: viewerScoped },
        { role, scoped },
        {
          role: GQLUSER_ROLE.MODERATOR,
          scoped: true,
        }
      ),
    [moderationScopesEnabled, role, scoped, viewerRole, viewerScoped]
  );
  const canChangeOrgMod = useMemo(
    () =>
      canChangeRole(
        { role: viewerRole, scoped: viewerScoped },
        { role, scoped },
        {
          role: GQLUSER_ROLE.MODERATOR,
          scoped: false,
        }
      ),
    [role, scoped, viewerRole, viewerScoped]
  );
  const canChangeAdmin = useMemo(
    () =>
      canChangeRole(
        { role: viewerRole, scoped: viewerScoped },
        { role, scoped },
        {
          role: GQLUSER_ROLE.ADMIN,
          scoped: false,
        }
      ),
    [role, scoped, viewerRole, viewerScoped]
  );
  const shouldPromoteSiteMod = useMemo(
    () => viewerRole === GQLUSER_ROLE.MODERATOR && viewerScoped,
    [viewerRole, viewerScoped]
  );

  /**
   * handleChangeRole combines the change role function with the change
   * moderation scopes.
   */
  const handleChangeRole = useCallback(
    async (r: GQLUSER_ROLE, siteIDs: string[] = []) => {
      if (moderationScopesEnabled) {
        await onChange(r, siteIDs);
      } else {
        await onChange(r);
      }
    },
    [onChange, moderationScopesEnabled]
  );
  const handlePromote = useCallback(async () => {
    await onPromote();
  }, [onPromote]);

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

  const MOD_ROLE_NAME = useMemo(() => GQLUSER_ROLE.MODERATOR, []);
  const onClick = useCallback(
    (r: GQLUSER_ROLE, siteIDs: string[]) => async () => {
      // if we're a site mod and we're upgrading someone to site mod
      // use the simple promotion flow
      if (
        r === MOD_ROLE_NAME &&
        siteIDs &&
        siteIDs.length > 0 &&
        viewerRole === MOD_ROLE_NAME &&
        viewerScoped
      ) {
        await handlePromote();
      } else {
        await handleChangeRole(r, siteIDs ? siteIDs : []);
      }

      togglePopoverVisibility();
    },
    [
      MOD_ROLE_NAME,
      handleChangeRole,
      handlePromote,
      togglePopoverVisibility,
      viewerRole,
      viewerScoped,
    ]
  );

  const onClickChangeSiteMod = useCallback(async () => {
    // Site mod promote flow
    if (canChangeSiteMod && shouldPromoteSiteMod) {
      const sites = viewerSites ? viewerSites : [];
      await onClick(viewerRole, sites)();
    }
    // Other mod/admin site mod selection flow
    else {
      setModalVisibility(true);
      setPopoverVisibility(false);
    }
  }, [
    canChangeSiteMod,
    onClick,
    setModalVisibility,
    setPopoverVisibility,
    shouldPromoteSiteMod,
    viewerRole,
    viewerSites,
  ]);

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
                {canChangeCommenter && (
                  <UserRoleChangeButton
                    active={role === GQLUSER_ROLE.COMMENTER}
                    role={GQLUSER_ROLE.COMMENTER}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.COMMENTER, [])}
                  />
                )}
                {canChangeStaff && (
                  <UserRoleChangeButton
                    active={role === GQLUSER_ROLE.STAFF}
                    role={GQLUSER_ROLE.STAFF}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.STAFF, [])}
                  />
                )}
                {canChangeSiteMod && (
                  <UserRoleChangeButton
                    active={scoped && role === GQLUSER_ROLE.MODERATOR}
                    role={GQLUSER_ROLE.MODERATOR}
                    scoped
                    moderationScopesEnabled
                    onClick={onClickChangeSiteMod}
                  />
                )}
                {canChangeOrgMod && (
                  <UserRoleChangeButton
                    active={
                      (!moderationScopesEnabled ||
                        (moderationScopesEnabled && !scoped)) &&
                      role === GQLUSER_ROLE.MODERATOR
                    }
                    role={GQLUSER_ROLE.MODERATOR}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.MODERATOR, [])}
                  />
                )}
                {canChangeAdmin && (
                  <UserRoleChangeButton
                    active={role === GQLUSER_ROLE.ADMIN}
                    role={GQLUSER_ROLE.ADMIN}
                    moderationScopesEnabled={moderationScopesEnabled}
                    onClick={onClick(GQLUSER_ROLE.ADMIN, [])}
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
