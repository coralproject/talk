import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";

import { SCHEDULED_DELETION_WINDOW_DURATION } from "coral-common/common/lib/constants";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
import { CoralMarkIcon, SvgIcon } from "coral-ui/components/icons";
import {
  CallOut,
  HorizontalGutter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import { UserDrawerAccountHistory_user } from "coral-admin/__generated__/UserDrawerAccountHistory_user.graphql";
import { UserDrawerAccountHistory_viewer } from "coral-admin/__generated__/UserDrawerAccountHistory_viewer.graphql";

import AccountHistoryAction, {
  HistoryActionProps,
} from "./AccountHistoryAction";
import { BanActionProps } from "./BanAction";
import DeleteAccountPopoverContainer from "./DeleteAccountPopoverContainer";

import styles from "./UserDrawerAccountHistory.css";

interface Props {
  user: UserDrawerAccountHistory_user;
  viewer: UserDrawerAccountHistory_viewer;
}

interface From {
  start: any;
  finish: any;
}

type HistoryRecord = HistoryActionProps & {
  date: Date;
  takenBy: React.ReactNode;
  description?: string | null;
};

const UserDrawerAccountHistory: FunctionComponent<Props> = ({
  user,
  viewer,
}) => {
  const system = (
    <Localized
      id="moderate-user-drawer-account-history-system"
      elems={{
        icon: (
          <SvgIcon
            size="md"
            className={styles.coralIcon}
            Icon={CoralMarkIcon}
          />
        ),
      }}
    >
      <span>
        <SvgIcon size="md" className={styles.coralIcon} Icon={CoralMarkIcon} />{" "}
        System
      </span>
    </Localized>
  );

  const { localeBundles } = useCoralContext();

  const deletionFormatter = useDateTimeFormatter({
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const addSeconds = (date: Date, seconds: number) => {
    return new Date(date.getTime() + seconds * 1000);
  };

  const deletionDescriptionMapping = useCallback(
    (updateType: string, createdAt: string) => {
      const mapping: { [key: string]: string } = {
        REQUESTED: getMessage(
          localeBundles,
          "moderate-user-drawer-account-history-deletion-scheduled",
          `Deletion scheduled for ${deletionFormatter(
            addSeconds(new Date(createdAt), SCHEDULED_DELETION_WINDOW_DURATION)
          )}`,
          {
            createdAt: deletionFormatter(
              addSeconds(
                new Date(createdAt),
                SCHEDULED_DELETION_WINDOW_DURATION
              )
            ),
          }
        ),
        CANCELED: getMessage(
          localeBundles,
          "moderate-user-drawer-account-history-canceled-at",
          `Canceled at ${deletionFormatter(new Date(createdAt))}`,
          { createdAt: deletionFormatter(new Date(createdAt)) }
        ),
        COMPLETED: getMessage(
          localeBundles,
          "moderate-user-drawer-account-history-completed-at",
          `Completed at ${deletionFormatter(new Date(createdAt))}`,
          { createdAt: deletionFormatter(new Date(createdAt)) }
        ),
        "%future added value": getMessage(
          localeBundles,
          "moderate-user-drawer-account-history-updated-at",
          `Updated at ${deletionFormatter(new Date(createdAt))}`,
          { createdAt: deletionFormatter(new Date(createdAt)) }
        ),
      };
      return mapping[updateType];
    },
    [getMessage, localeBundles, addSeconds, deletionFormatter]
  );

  const combinedHistory = useMemo(() => {
    // Collect all the different types of history items.
    const history: HistoryRecord[] = [];

    // Merge in all the suspension history items.
    user.status.suspension.history.forEach((record) => {
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

    const isBanned = user.status.ban.active;
    const isSiteBanned = !!(
      user.status.ban.sites && user.status.ban.sites.length > 0
    );
    let bannedSiteRecord: HistoryRecord | null = null;

    // Merge in all the ban status history items.
    user.status.ban.history.forEach((record, index) => {
      const siteBan = record.sites && record.sites.length > 0;

      if (
        (isBanned || isSiteBanned) &&
        index === user.status.ban.history.length - 1
      ) {
        bannedSiteRecord = {
          kind: siteBan ? "site-ban" : "ban",
          action: {
            action: record.active ? "created" : "removed",
          },
          date: new Date(record.createdAt),
          takenBy: record.createdBy ? record.createdBy.username : system,
          description:
            isSiteBanned && !!user.status.ban.sites
              ? user.status.ban.sites.map((s) => s.name).join(", ")
              : "",
        };
      } else {
        history.push({
          kind: siteBan ? "site-ban" : "ban",
          action: {
            action: record.active ? "created" : "removed",
          },
          date: new Date(record.createdAt),
          takenBy: record.createdBy ? record.createdBy.username : system,
          description:
            siteBan && record.sites
              ? record.sites.map((s) => s.name).join(", ")
              : "",
        });
      }
    });

    // Merge in all the premod history items.
    user.status.premod.history.forEach((record) => {
      history.push({
        kind: "premod",
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

    user.status.warning.history.forEach((record) => {
      let action: "created" | "acknowledged" | "removed";
      if (record.active) {
        action = "created";
      } else {
        if (record.acknowledgedAt) {
          action = "acknowledged";
        } else {
          action = "removed";
        }
      }
      history.push({
        kind: "warning",
        date: new Date(record.createdAt),
        takenBy: record.createdBy.username,
        action: {
          action,
          acknowledgedAt: record.acknowledgedAt
            ? new Date(record.acknowledgedAt)
            : null,
        },
        description: record.message,
      });
    });

    user.status.modMessage.history.forEach((record) => {
      const action: "created" | "acknowledged" = record.active
        ? "created"
        : "acknowledged";
      history.push({
        kind: "modMessage",
        date: new Date(record.createdAt),
        takenBy: record.createdBy.username,
        action: {
          action,
          acknowledgedAt: record.acknowledgedAt
            ? new Date(record.acknowledgedAt)
            : null,
        },
        description: record.message,
      });
    });

    user.status.deletion.history.forEach((record) => {
      history.push({
        kind: "deletion",
        date: new Date(record.createdAt),
        takenBy: record.createdBy ? record.createdBy.username : system,
        action: { action: record.updateType },
        description: deletionDescriptionMapping(
          record.updateType,
          record.createdAt
        ),
      });
    });

    // Sort the history so that it's in the right order.
    const dateSortedHistory = history.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    if ((isBanned || isSiteBanned) && bannedSiteRecord !== null) {
      dateSortedHistory.unshift(bannedSiteRecord);
    }

    return dateSortedHistory;
  }, [system, user.status, deletionDescriptionMapping]);
  const formatter = useDateTimeFormatter({
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (combinedHistory.length === 0) {
    return (
      <>
        {viewer.role === GQLUSER_ROLE.ADMIN && (
          <div className={styles.deleteButtonWrapper}>
            <DeleteAccountPopoverContainer user={user} />
          </div>
        )}
        <CallOut fullWidth>
          <Localized id="moderate-user-drawer-account-history-no-history">
            No actions have been taken on this account
          </Localized>
        </CallOut>
      </>
    );
  }

  const computeRowClass = (history: HistoryRecord, index: number) => {
    if (index > 0 || (history.kind !== "ban" && history.kind !== "site-ban")) {
      return styles.row;
    }

    const props = history.action as BanActionProps;
    if (!props) {
      return styles.row;
    }

    if (props.action === "created") {
      return styles.rowBanned;
    }

    return styles.row;
  };

  return (
    <HorizontalGutter size="double">
      {viewer.role === GQLUSER_ROLE.ADMIN && (
        <DeleteAccountPopoverContainer user={user} />
      )}
      <Table fullWidth>
        <TableHead className={styles.tableHeader}>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Taken By</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {combinedHistory.map((history, index) => (
            <TableRow key={index} className={computeRowClass(history, index)}>
              <TableCell className={styles.date}>
                {formatter(history.date)}
              </TableCell>
              <TableCell className={styles.action}>
                <AccountHistoryAction {...history} />
              </TableCell>
              <TableCell className={styles.user}>{history.takenBy}</TableCell>
              <TableCell className={styles.description}>
                {history.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<any>({
  viewer: graphql`
    fragment UserDrawerAccountHistory_viewer on User {
      id
      role
    }
  `,
  user: graphql`
    fragment UserDrawerAccountHistory_user on User {
      ...DeleteAccountPopoverContainer_user
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
        deletion {
          history {
            updateType
            createdAt
            createdBy {
              username
            }
          }
        }
        warning {
          history {
            active
            createdBy {
              username
            }
            acknowledgedAt
            createdAt
            message
          }
        }
        modMessage {
          history {
            active
            createdBy {
              username
            }
            acknowledgedAt
            createdAt
            message
          }
        }
        ban {
          history {
            active
            createdBy {
              username
            }
            createdAt
            sites {
              name
            }
          }
          active
          sites {
            id
            name
          }
        }
        premod {
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
