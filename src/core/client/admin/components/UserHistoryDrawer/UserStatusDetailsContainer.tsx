import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
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
  if (!user.status.ban.active && !user.status.suspension.active) {
    return null;
  }

  const activeBan = useMemo(() => {
    return user.status.ban.history.find(item => item.active);
  }, [user]);

  const activeSuspension = useMemo(() => {
    return user.status.suspension.history.find(item => item.active);
  }, [user]);

  const { locales } = useCoralContext();

  const formatter = new Intl.DateTimeFormat(locales, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div>
      <Popover
        placement="bottom"
        id="userStatus-details-popover"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <Box p={2}>
              {activeBan && (
                <div>
                  <Localized
                    id="userDetails-banned-on"
                    $timestamp={formatter.format(new Date(activeBan.createdAt))}
                    strong={<strong />}
                  >
                    <p className={styles.root}>
                      <strong>Banned on </strong>{" "}
                      {formatter.format(new Date(activeBan.createdAt))}
                    </p>
                  </Localized>
                  {activeBan.createdBy && (
                    <Localized
                      id="userDetails-banned-by"
                      strong={<strong />}
                      $username={activeBan.createdBy.username}
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
                      strong={<strong />}
                      $username={activeSuspension.createdBy.username}
                    >
                      <p className={styles.root}>
                        <strong>Suspended by </strong>
                        {activeSuspension.createdBy.username}
                      </p>
                    </Localized>
                  )}
                  <Localized
                    id="userDetails-suspension-start"
                    strong={<strong />}
                    $timestamp={formatter.format(
                      new Date(activeSuspension.from.start)
                    )}
                  >
                    <p className={styles.root}>
                      <strong>Start: </strong>
                      {formatter.format(new Date(activeSuspension.from.start))}
                    </p>
                  </Localized>
                  <Localized
                    strong={<strong />}
                    $timestamp={formatter.format(
                      new Date(activeSuspension.from.finish)
                    )}
                    id="userDetails-suspension-finish"
                  >
                    <p className={styles.root}>
                      <strong>End: </strong>
                      {formatter.format(new Date(activeSuspension.from.finish))}
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
            onClick={evt => {
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
