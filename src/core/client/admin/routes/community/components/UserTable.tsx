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
import styles from "./UserTable.css";

interface Props {
  users: Array<{ id: string } & PropTypesOf<typeof UserRowContainer>["user"]>;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  loading: boolean;
}

const UserTable: StatelessComponent<Props> = props => (
  <>
    <HorizontalGutter>
      <Table fullWidth>
        <TableHead>
          <TableRow>
            <TableCell className={styles.usernameColumn}>Username</TableCell>
            <TableCell className={styles.emailColumn}>Email Address</TableCell>
            <TableCell className={styles.memberSinceColumn}>
              Member Since
            </TableCell>
            <TableCell className={styles.roleColumn}>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.users.map(u => <UserRowContainer key={u.id} user={u} />)}
        </TableBody>
      </Table>
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
