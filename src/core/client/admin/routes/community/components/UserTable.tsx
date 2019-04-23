import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";

import AutoLoadMoreContainer from "talk-admin/containers/AutoLoadMoreContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "talk-ui/components/Table";

import UserRowContainer from "../containers/UserRowContainer";

import { Flex, HorizontalGutter, Spinner } from "talk-ui/components";
import EmptyMessage from "./EmptyMessage";

import styles from "./UserTable.css";

interface Props {
  viewer: PropTypesOf<typeof UserRowContainer>["viewer"] | null;
  users: Array<{ id: string } & PropTypesOf<typeof UserRowContainer>["user"]>;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const UserTable: StatelessComponent<Props> = props => (
  <>
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
            props.users.map(u => (
              <UserRowContainer key={u.id} user={u} viewer={props.viewer!} />
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
          <AutoLoadMoreContainer
            disableLoadMore={props.disableLoadMore}
            onLoadMore={props.onLoadMore}
          />
        </Flex>
      )}
    </HorizontalGutter>
  </>
);

export default UserTable;
