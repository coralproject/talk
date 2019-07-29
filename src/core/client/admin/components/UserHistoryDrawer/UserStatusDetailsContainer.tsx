import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { UserStatusDetailsContainer_user as UserData } from "coral-admin/__generated__/UserStatusDetailsContainer_user.graphql";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  BaseButton,
  Box,
  ClickOutside,
  Icon,
  Popover,
  Typography,
} from "coral-ui/components";

interface Props {
  user: UserData;
}

const UserStatusDetailsContainer: FunctionComponent<Props> = ({ user }) => {
  if (!user.status.ban.active && !user.status.suspension.active) {
    return null;
  }
  const activeBan = user.status.ban.history.find(item => item.active);
  const activeSuspension = user.status.suspension.history.find(
    item => item.active
  );
  const { locales } = useCoralContext();

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat(locales, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }
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
                    $timestamp={formatDate(activeBan.createdAt)}
                    strong={<strong />}
                  >
                    <Typography>
                      <strong>Banned on </strong>{" "}
                      {formatDate(activeBan.createdAt)}
                    </Typography>
                  </Localized>
                  {activeBan.createdBy && (
                    <Localized
                      id="userDetails-banned-by"
                      strong={<strong />}
                      $username={activeBan.createdBy.username}
                    >
                      <Typography>
                        <strong>by </strong>
                        {activeBan.createdBy.username}
                      </Typography>
                    </Localized>
                  )}
                </div>
              )}
              {activeSuspension && (
                <div>
                  <Localized id="userDetails-suspension">
                    <Typography variant="bodyCopyBold">Suspension</Typography>
                  </Localized>
                  {activeSuspension.createdBy && (
                    <Localized
                      id="userDetails-suspended-by"
                      strong={<strong />}
                      $username={activeSuspension.createdBy.username}
                    >
                      <Typography>
                        <strong>by </strong>
                        {activeSuspension.createdBy.username}
                      </Typography>
                    </Localized>
                  )}
                  <Localized
                    id="userDetails-suspension-start"
                    strong={<strong />}
                    $timestamp={formatDate(activeSuspension.from.start)}
                  >
                    <Typography>
                      <strong>Start: </strong>
                      {formatDate(activeSuspension.from.start)}
                    </Typography>
                  </Localized>
                  <Localized
                    strong={<strong />}
                    $timestamp={formatDate(activeSuspension.from.finish)}
                    id="userDetails-suspension-start"
                  >
                    <Typography>
                      <strong>End: </strong>
                      {formatDate(activeSuspension.from.finish)}
                    </Typography>
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
              id
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
              id
            }
          }
        }
      }
    }
  `,
})(UserStatusDetailsContainer);

export default enhanced;
