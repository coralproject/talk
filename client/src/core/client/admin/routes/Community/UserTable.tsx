import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import { PropTypesOf } from "coral-framework/types";
import {
  Flex,
  HorizontalGutter,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import EmptyMessage from "./EmptyMessage";
import UserRowContainer from "./UserRowContainer";

import styles from "./UserTable.css";

interface Props {
  viewer: PropTypesOf<typeof UserRowContainer>["viewer"] | null;
  settings: PropTypesOf<typeof UserRowContainer>["settings"] | null;
  users: Array<{ id: string } & PropTypesOf<typeof UserRowContainer>["user"]>;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const UserTable: FunctionComponent<Props> = ({
  viewer,
  settings,
  ...props
}) => {
  const [userDrawerUserID, setUserDrawerUserID] = useState<string | undefined>(
    undefined
  );
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);

  const onShowUserDrawer = useCallback(
    (userID: string) => {
      setUserDrawerUserID(userID);
      setUserDrawerVisible(true);
    },
    [setUserDrawerUserID, setUserDrawerVisible]
  );

  const onHideUserDrawer = useCallback(() => {
    setUserDrawerVisible(false);
    setUserDrawerUserID(undefined);
  }, [setUserDrawerUserID, setUserDrawerVisible]);

  const onSetUserID = useCallback(
    (userID: string) => {
      setUserDrawerUserID(userID);
    },
    [setUserDrawerUserID]
  );

  return (
    <HorizontalGutter size="double">
      <Table fullWidth>
        <TableHead>
          <TableRow>
            <Localized id="community-column-username">
              <TableCell className={styles.usernameColumn}>Username</TableCell>
            </Localized>
            <Localized id="community-column-email">
              <TableCell className={styles.emailColumn}>
                Email Address
              </TableCell>
            </Localized>
            <Localized id="community-column-memberSince">
              <TableCell className={styles.memberSinceColumn}>
                Member Since
              </TableCell>
            </Localized>
            <Localized id="community-column-role">
              <TableCell className={styles.roleColumn}>Role</TableCell>
            </Localized>
            <Localized id="community-column-status">
              <TableCell className={styles.statusColumn}>Status</TableCell>
            </Localized>
          </TableRow>
        </TableHead>
        <TableBody>
          {!props.loading &&
            settings &&
            viewer &&
            props.users.map((user) => (
              <UserRowContainer
                key={user.id}
                user={user}
                settings={settings}
                viewer={viewer}
                onUsernameClicked={onShowUserDrawer}
              />
            ))}
        </TableBody>
      </Table>
      {!props.loading && props.users.length === 0 && <EmptyMessage />}
      {props.loading && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {props.hasMore && (
        <Flex justifyContent="center">
          <AutoLoadMore
            disableLoadMore={props.disableLoadMore}
            onLoadMore={props.onLoadMore}
          />
        </Flex>
      )}
      <UserHistoryDrawer
        userID={userDrawerUserID}
        open={userDrawerVisible}
        onClose={onHideUserDrawer}
        setUserID={onSetUserID}
      />
    </HorizontalGutter>
  );
};

export default UserTable;
