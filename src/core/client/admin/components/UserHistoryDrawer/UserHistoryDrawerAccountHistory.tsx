import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";

import { UserHistoryDrawerAccountHistory_user } from "coral-admin/__generated__/UserHistoryDrawerAccountHistory_user.graphql";

interface Props {
  user: UserHistoryDrawerAccountHistory_user;
}

interface From {
  start: any;
  finish: any;
}

interface Record {
  type: string;
  createdBy: string | null | undefined;
  createdAt: Date;
  active: boolean;
  from: From | undefined;
}

const UserHistoryDrawerAccountHistory: FunctionComponent<Props> = ({
  user,
}) => {
  const banHistory: Record[] = user.status.ban.history
    ? user.status.ban.history.map(i => {
        return {
          type: "ban",
          createdBy: i.createdBy ? i.createdBy.username : undefined,
          createdAt: new Date(i.createdAt),
          active: i.active,
          from: undefined,
        };
      })
    : [];
  const suspensionHistory: Record[] = user.status.suspension.history
    ? user.status.suspension.history.map(i => {
        const from: From = {
          start: i.from.start,
          finish: i.from.finish,
        };

        return {
          type: "suspension",
          createdBy: i.createdBy ? i.createdBy.username : undefined,
          createdAt: new Date(i.createdAt),
          active: i.active,
          from,
        };
      })
    : [];
  const combinedHistory = banHistory
    .concat(suspensionHistory)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <>
      {combinedHistory.map((history, index) => {
        return (
          <div key={index}>
            <div>{history.type}</div>
            <div>
              {history.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </div>
            <div>{history.createdBy}</div>
          </div>
        );
      })}
    </>
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
