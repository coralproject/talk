import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import UserRole from "coral-admin/components/UserRole";
import UserStatus from "coral-admin/components/UserStatus";
import { PropTypesOf } from "coral-framework/types";
import { Button, TableCell, TableRow, TextLink } from "coral-ui/components/v2";

import styles from "./UserRow.css";

interface Props {
  userID: string;
  username: string | null;
  email: string | null;
  memberSince: string;
  user: PropTypesOf<typeof UserRole>["user"] &
    PropTypesOf<typeof UserStatus>["user"];
  viewer: PropTypesOf<typeof UserRole>["viewer"];
  settings: PropTypesOf<typeof UserStatus>["settings"];
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
    <TableRow>
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
            {username || <NotAvailable />}
          </Button>
        )}
      </TableCell>
      <TableCell className={styles.emailColumn}>
        {<TextLink href={`mailto:${email}`}>{email}</TextLink> || (
          <NotAvailable />
        )}
      </TableCell>
      <TableCell className={styles.memberSinceColumn}>{memberSince}</TableCell>
      <TableCell className={styles.roleColumn}>
        <UserRole user={user} viewer={viewer} />
      </TableCell>
      <TableCell className={styles.statusColumn}>
        <UserStatus user={user} settings={settings} fullWidth />
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
