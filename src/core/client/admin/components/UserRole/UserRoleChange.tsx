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
  isMultisite?: boolean;
  query: PropTypesOf<typeof SiteModeratorModal>["query"];
}

const UserRoleChange: FunctionComponent<Props> = ({
  username,
  role,
  scoped,
  onChangeRole,
  onChangeModerationScopes,
  moderationScopes,
  isMultisite = false,
  query,
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

      if (isMultisite) {
        await onChangeModerationScopes(siteIDs);
      }
    },
    [onChangeRole, onChangeModerationScopes, isMultisite]
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

  return (
    <>
      {isMultisite && (
        <SiteModeratorModal
          username={username}
          open={isModalVisible}
          query={query}
          selectedSiteIDs={selectedSiteIDs}
          onCancel={toggleModalVisibility}
          onFinish={onFinishModal}
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
                <UserRoleChangeButton
                  active={role === GQLUSER_ROLE.COMMENTER}
                  role={GQLUSER_ROLE.COMMENTER}
                  isMultisite={isMultisite}
                  onClick={onClick(GQLUSER_ROLE.COMMENTER)}
                />
                <UserRoleChangeButton
                  active={role === GQLUSER_ROLE.STAFF}
                  role={GQLUSER_ROLE.STAFF}
                  isMultisite={isMultisite}
                  onClick={onClick(GQLUSER_ROLE.STAFF)}
                />
                {isMultisite && (
                  <UserRoleChangeButton
                    active={scoped && role === GQLUSER_ROLE.MODERATOR}
                    role={GQLUSER_ROLE.MODERATOR}
                    scoped
                    isMultisite
                    onClick={() => {
                      setModalVisibility(true);
                      setPopoverVisibility(false);
                    }}
                  />
                )}
                <UserRoleChangeButton
                  active={
                    (!isMultisite || (isMultisite && !scoped)) &&
                    role === GQLUSER_ROLE.MODERATOR
                  }
                  role={GQLUSER_ROLE.MODERATOR}
                  isMultisite={isMultisite}
                  onClick={onClick(GQLUSER_ROLE.MODERATOR)}
                />
                <UserRoleChangeButton
                  active={role === GQLUSER_ROLE.ADMIN}
                  role={GQLUSER_ROLE.ADMIN}
                  isMultisite={isMultisite}
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
                  isMultisite={isMultisite}
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
