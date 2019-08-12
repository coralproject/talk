import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { UserDrawerAccountHistory_user } from "coral-admin/__generated__/UserDrawerAccountHistory_user.graphql";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import {
  CallOut,
  HorizontalGutter,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components";

import AccountHistoryAction, {
  HistoryActionProps,
} from "./AccountHistoryAction";

import styles from "./UserDrawerAccountHistory.css";

interface Props {
  user: UserDrawerAccountHistory_user;
}

interface From {
  start: any;
  finish: any;
}

type HistoryRecord = HistoryActionProps & {
  date: Date;
  takenBy: React.ReactNode;
};

const UserDrawerAccountHistory: FunctionComponent<Props> = ({ user }) => {
  const system = (
    <Localized
      id="moderate-user-drawer-account-history-system"
      icon={<Icon size="md">computer</Icon>}
    >
      <span>
        <Icon size="md">computer</Icon> System
      </span>
    </Localized>
  );
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
          takenBy: record.modifiedBy ? record.modifiedBy.username : system,
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
          takenBy: system,
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
        takenBy: record.createdBy ? record.createdBy.username : system,
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
        takenBy: record.createdBy ? record.createdBy.username : system,
      });
    });

    user.status.username.history.forEach((record, i) => {
      history.push({
        kind: "username",
        action: {
          username: record.username,
          // grab username at previous index to show what username was changed from
          prevUsername:
            i >= 1 ? user.status.username.history[i - 1].username : null,
        },
        date: new Date(record.createdAt),
        takenBy: record.createdBy ? record.createdBy.username : system,
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
                <AccountHistoryAction {...history} />
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
        username {
          history {
            username
            createdAt
            createdBy {
              username
            }
          }
        }
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
