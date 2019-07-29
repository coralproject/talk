import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { UserDrawerAccountHistory_user } from "coral-admin/__generated__/UserDrawerAccountHistory_user.graphql";

import { useCoralContext } from "coral-framework/lib/bootstrap";
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

import BanAction, { BanActionProps } from "./BanAction";
import SuspensionAction, { SuspensionActionProps } from "./SuspensionAction";

import styles from "./UserDrawerAccountHistory.css";

interface Props {
  user: UserDrawerAccountHistory_user;
}

interface From {
  start: any;
  finish: any;
}

interface SuspensionHistoryRecord {
  kind: "suspension";
  action: SuspensionActionProps;
  date: Date;
  takenBy: React.ReactNode;
}

interface BanHistoryRecord {
  kind: "ban";
  action: BanActionProps;
  date: Date;
  takenBy: React.ReactNode;
}

type HistoryRecord = SuspensionHistoryRecord | BanHistoryRecord;

const UserDrawerAccountHistory: FunctionComponent<Props> = ({ user }) => {
  const { locales } = useCoralContext();
  const combinedHistory = useMemo(() => {
    // Collect all the different types of history items.
    const history: HistoryRecord[] = [];

    // Merge in all the suspension history items.
    user.status.suspension.history.forEach(record => {
      const from: From = {
        start: new Date(record.from.start),
        finish: new Date(record.from.finish),
      };

      if (record.modifiedAt) {
        // Merge in the suspension removals.
        history.push({
          kind: "suspension",
          action: {
            action: "removed",
            from,
          },
          date: new Date(record.modifiedAt),
          takenBy: record.modifiedBy ? record.modifiedBy.username : "System",
        });
      } else if (!record.active) {
        // Merge in the suspension expiries.
        history.push({
          kind: "suspension",
          action: {
            action: "ended",
            from,
          },
          date: from.finish,
          takenBy: "System",
        });
      }

      // Merge in the suspension created.
      history.push({
        kind: "suspension",
        action: {
          action: "created",
          from,
        },
        date: new Date(record.createdAt),
        takenBy: record.createdBy ? record.createdBy.username : "System",
      });
    });

    // Merge in all the ban status history items.
    user.status.ban.history.forEach(record => {
      history.push({
        kind: "ban",
        action: {
          action: record.active ? "created" : "removed",
        },
        date: new Date(record.createdAt),
        takenBy: record.createdBy ? record.createdBy.username : "System",
      });
    });

    // Sort the history so that it's in the right order.
    return history.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [user]);
  const formatter = new Intl.DateTimeFormat(locales, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          {combinedHistory.map((history, index) => (
            <TableRow key={index} className={styles.row}>
              <TableCell className={styles.date}>
                {formatter.format(history.date)}
              </TableCell>
              <TableCell className={styles.action}>
                {history.kind === "suspension" ? (
                  <SuspensionAction {...history.action} />
                ) : (
                  <BanAction {...history.action} />
                )}
              </TableCell>
              <TableCell className={styles.user}>{history.takenBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<any>({
  user: graphql`
    fragment UserDrawerAccountHistory_user on User {
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
            modifiedAt
            modifiedBy {
              username
            }
            createdAt
          }
        }
      }
    }
  `,
})(UserDrawerAccountHistory);

export default enhanced;
