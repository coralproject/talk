import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { UserRoleChangeContainer } from "coral-admin/components/UserRole";
import UserStatus from "coral-admin/components/UserStatus";
import { PropTypesOf } from "coral-framework/types";
import { Button, TableCell, TableRow, TextLink } from "coral-ui/components/v2";

import styles from "./UserRow.css";

interface Props {
  userID: string;
  username: string | null;
  email: string | null;
  memberSince: string;
  user: PropTypesOf<typeof UserRoleChangeContainer>["user"] &
    PropTypesOf<typeof UserStatus>["user"];
  viewer: PropTypesOf<typeof UserRoleChangeContainer>["viewer"] &
    PropTypesOf<typeof UserStatus>["viewer"];
  settings: PropTypesOf<typeof UserStatus>["settings"] &
    PropTypesOf<typeof UserRoleChangeContainer>["settings"];
  onUsernameClicked?: (userID: string) => void;
  deletedAt?: string | null;
}

const UserRow: FunctionComponent<Props> = ({
  userID,
  username,
  email,
  memberSince,
  user,
  viewer,
  onUsernameClicked,
  settings,
  deletedAt,
}) => {
  const usernameClicked = useCallback(() => {
    if (!onUsernameClicked) {
      return;
    }

    onUsernameClicked(userID);
  }, [userID, onUsernameClicked]);

  return (
    <TableRow data-testid={`community-row-${userID}`}>
      <TableCell className={styles.usernameColumn}>
        {deletedAt && (
          <>
            <div className={styles.username}>
              {username || <NotAvailable />}
            </div>
            <div className={styles.deleted}>
              <Localized id="community-column-username-deleted">
                Deleted
              </Localized>
            </div>
          </>
        )}
        {!deletedAt && (
          <Button
            variant="text"
            color="mono"
            uppercase={false}
            onClick={usernameClicked}
            className={styles.usernameButton}
          >
            {username || (
              <Localized id="community-column-username-not-available">
                <span className={styles.notAvailable}>
                  Username not available
                </span>
              </Localized>
            )}
          </Button>
        )}
      </TableCell>
      <TableCell className={styles.emailColumn}>
        {email ? (
          <TextLink href={`mailto:${email}`}>{email}</TextLink>
        ) : (
          <Localized id="community-column-email-not-available">
            <span className={styles.notAvailable}>Email not available</span>
          </Localized>
        )}
      </TableCell>
      <TableCell className={styles.memberSinceColumn}>{memberSince}</TableCell>
      <TableCell className={styles.roleColumn}>
        <UserRoleChangeContainer
          user={user}
          viewer={viewer}
          settings={settings}
        />
      </TableCell>
      <TableCell className={styles.statusColumn}>
        <UserStatus user={user} settings={settings} viewer={viewer} fullWidth />
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
