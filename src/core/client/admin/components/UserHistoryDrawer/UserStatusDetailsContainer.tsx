import { Localized } from "@fluent/react/compat";
import { last } from "lodash";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  BaseButton,
  Box,
  ClickOutside,
  Icon,
  Popover,
} from "coral-ui/components/v2";

import { UserStatusDetailsContainer_user as UserData } from "coral-admin/__generated__/UserStatusDetailsContainer_user.graphql";

import styles from "./UserStatusDetailsContainer.css";

interface Props {
  user: UserData;
}

const UserStatusDetailsContainer: FunctionComponent<Props> = ({ user }) => {
  const activeBan = useMemo(() => {
    if (user.status.ban.active) {
      return last(user.status.ban.history);
    }
    return null;
  }, [user]);

  const activeSuspension = useMemo(() => {
    return user.status.suspension.history.find((item) => item.active);
  }, [user]);

  const activeWarning = useMemo(() => {
    if (user.status.warning.active) {
      return last(user.status.warning.history);
    }
    return null;
  }, [user]);

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  if (
    !user.status.ban.active &&
    !user.status.suspension.active &&
    !user.status.warning.active
  ) {
    return null;
  }

  return (
    <div>
      <Popover
        placement="bottom"
        id="userStatus-details-popover"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <Box p={2}>
              {activeWarning && (
                <div>
                  <Localized
                    id="userDetails-warned-on"
                    vars={{ timestamp: formatter(activeWarning.createdAt) }}
                    elems={{
                      strong: <strong />,
                    }}
                  >
                    <p className={styles.root}>
                      <strong>Warned on </strong>{" "}
                      {formatter(activeWarning.createdAt)}
                    </p>
                  </Localized>
                  {activeWarning.createdBy && (
                    <Localized
                      id="userDetails-warned-by"
                      elems={{
                        strong: <strong />,
                      }}
                      vars={{
                        username: activeWarning.createdBy.username,
                      }}
                    >
                      <p className={styles.root}>
                        <strong>by </strong>
                        {activeWarning.createdBy.username}
                      </p>
                    </Localized>
                  )}
                  <Localized id="userDetails-warned-explanation">
                    <p className={styles.root}>
                      User has not acknowledged the warning.
                    </p>
                  </Localized>
                </div>
              )}
              {activeBan && (
                <div>
                  <Localized
                    id="userDetails-banned-on"
                    vars={{ timestamp: formatter(activeBan.createdAt) }}
                    elems={{
                      strong: <strong />,
                    }}
                  >
                    <p className={styles.root}>
                      <strong>Banned on </strong>{" "}
                      {formatter(activeBan.createdAt)}
                    </p>
                  </Localized>
                  {activeBan.createdBy && (
                    <Localized
                      id="userDetails-banned-by"
                      elems={{
                        strong: <strong />,
                      }}
                      vars={{
                        username: activeBan.createdBy.username,
                      }}
                    >
                      <p className={styles.root}>
                        <strong>by </strong>
                        {activeBan.createdBy.username}
                      </p>
                    </Localized>
                  )}
                </div>
              )}
              {activeSuspension && (
                <div>
                  {activeSuspension.createdBy && (
                    <Localized
                      id="userDetails-suspended-by"
                      elems={{
                        strong: <strong />,
                      }}
                      vars={{
                        username: activeSuspension.createdBy.username,
                      }}
                    >
                      <p className={styles.root}>
                        <strong>Suspended by </strong>
                        {activeSuspension.createdBy.username}
                      </p>
                    </Localized>
                  )}
                  <Localized
                    id="userDetails-suspension-start"
                    elems={{
                      strong: <strong />,
                    }}
                    vars={{ timestamp: formatter(activeSuspension.from.start) }}
                  >
                    <p className={styles.root}>
                      <strong>Start: </strong>
                      {formatter(activeSuspension.from.start)}
                    </p>
                  </Localized>
                  <Localized
                    elems={{
                      strong: <strong />,
                    }}
                    vars={{
                      timestamp: formatter(activeSuspension.from.finish),
                    }}
                    id="userDetails-suspension-finish"
                  >
                    <p className={styles.root}>
                      <strong>End: </strong>
                      {formatter(activeSuspension.from.finish)}
                    </p>
                  </Localized>
                </div>
              )}
            </Box>
          </ClickOutside>
        )}
      >
        {({ toggleVisibility, ref }) => (
          <BaseButton
            onClick={(evt) => {
              evt.stopPropagation();
              toggleVisibility();
            }}
            aria-label="View user status details"
            ref={ref}
          >
            <Icon size="md" color="inherit">
              info
            </Icon>
          </BaseButton>
        )}
      </Popover>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment UserStatusDetailsContainer_user on User {
      status {
        warning {
          active
          history {
            active
            createdBy {
              username
            }
            createdAt
          }
        }
        ban {
          active
          history {
            active
            createdAt
            createdBy {
              username
            }
          }
        }
        suspension {
          until
          active
          history {
            active
            from {
              start
              finish
            }
            createdBy {
              username
            }
          }
        }
      }
    }
  `,
})(UserStatusDetailsContainer);

export default enhanced;
