import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
// import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { UserStatusDetailsContainer_user as UserData } from "coral-admin/__generated__/UserStatusDetailsContainer_user.graphql";
import {
  BaseButton,
  Box,
  ClickOutside,
  Icon,
  Popover,
  Typography,
} from "coral-ui/components";

// import styles from "./UserStatusDetailsContainer";

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
  return (
    <div>
      <Popover
        placement="bottom"
        id="userStatus-details-popover"
        body={({ toggleVisibility }) => (
          <ClickOutside onClickOutside={toggleVisibility}>
            <Box
              p={2}
              onClick={evt => {
                // Don't propagate click events when clicking inside of popover to
                // avoid accidently activating the featured comments tab.
                evt.stopPropagation();
              }}
            >
              {activeBan && (
                <div>
                  <Typography>
                    <strong>Banned on </strong>
                    {activeBan.createdAt}
                  </Typography>
                  {activeBan.createdBy && (
                    <Typography>
                      <strong>by </strong>
                      {activeBan.createdBy.username}
                    </Typography>
                  )}
                </div>
              )}
              {activeSuspension && (
                <div>
                  <Typography>
                    <strong>Suspenion</strong>
                  </Typography>
                  {activeSuspension.createdBy && (
                    <Typography>
                      <strong>by </strong>
                      {activeSuspension.createdBy.username}
                    </Typography>
                  )}
                  <Typography>
                    <strong>Start: </strong>
                    {activeSuspension.from.start}
                  </Typography>
                  <Typography>
                    <strong>End:</strong> {activeSuspension.from.finish}
                  </Typography>
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
