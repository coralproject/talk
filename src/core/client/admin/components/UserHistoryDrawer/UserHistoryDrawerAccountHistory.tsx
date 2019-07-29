import React, { FunctionComponent, useMemo } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import {
  CallOut,
  HorizontalGutter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components";

import { UserHistoryDrawerAccountHistory_user } from "coral-admin/__generated__/UserHistoryDrawerAccountHistory_user.graphql";

import BanRecord from "./BanRecord";
import SuspensionRecord from "./SuspensionRecord";

import { Localized } from "fluent-react/compat";
import styles from "./UserHistoryDrawerAccountHistory.css";

interface Props {
  user: UserHistoryDrawerAccountHistory_user;
}

interface From {
  start: any;
  finish: any;
}

type RecordKind = "ban" | "suspension";

interface Record {
  kind: RecordKind;
  createdBy?: string | null;
  createdAt: Date;
  active: boolean;
  from?: From;
}

const UserHistoryDrawerAccountHistory: FunctionComponent<Props> = ({
  user,
}) => {
  const combinedHistory = useMemo(() => {
    // Collect all the history items across suspensions and bans.
    const history: Record[] = [
      // Merge in the ban history.
      ...user.status.ban.history.map(
        (record): Record => ({
          kind: "ban",
          createdBy: record.createdBy ? record.createdBy.username : undefined,
          createdAt: new Date(record.createdAt),
          active: record.active,
        })
      ),

      // Merge in the suspension history.
      ...user.status.suspension.history.map(
        (record): Record => ({
          kind: "suspension",
          createdBy: record.createdBy ? record.createdBy.username : undefined,
          createdAt: new Date(record.createdAt),
          active: record.active,
          from: {
            start: record.from.start,
            finish: record.from.finish,
          },
        })
      ),
    ];

    // Sort the history so that it's in the right order.
    return history.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }, [user]);

  if (combinedHistory.length === 0) {
    return (
      <CallOut fullWidth>
        <Localized id="moderate-user-drawer-account-history-no-history">
          No actions have been taken on this account
        </Localized>
      </CallOut>
    );
  }

  return (
    <HorizontalGutter size="double">
      <Table fullWidth>
        <TableHead className={styles.tableHeader}>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Taken By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {combinedHistory.map((history, index) => {
            if (history.kind === "ban") {
              return (
                <BanRecord
                  key={index}
                  createdAt={history.createdAt}
                  active={history.active}
                  createdBy={history.createdBy}
                />
              );
            } else {
              return (
                <SuspensionRecord
                  key={index}
                  createdAt={history.createdAt}
                  active={history.active}
                  from={history.from!}
                  createdBy={history.createdBy}
                />
              );
            }
          })}
        </TableBody>
      </Table>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<any>({
  user: graphql`
    fragment UserHistoryDrawerAccountHistory_user on User {
      status {
        ban {
          history {
            active
            createdBy {
              username
            }
            createdAt
          }
        }
        suspension {
          history {
            active
            from {
              start
              finish
            }
            createdBy {
              username
            }
            createdAt
          }
        }
      }
    }
  `,
})(UserHistoryDrawerAccountHistory);

export default enhanced;
