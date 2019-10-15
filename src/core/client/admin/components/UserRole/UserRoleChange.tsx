import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import TranslatedRole from "coral-admin/components/TranslatedRole";
import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";
import {
  Button,
  ButtonIcon,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Popover,
} from "coral-ui/components";

import UserRoleText from "./UserRoleText";

import styles from "./UserRoleChange.css";

interface Props {
  onChangeRole: (role: GQLUSER_ROLE_RL) => void;
  role: GQLUSER_ROLE_RL;
}

const UserRoleChange: FunctionComponent<Props> = props => (
  <Localized id="community-role-popover" attrs={{ description: true }}>
    <Popover
      id="community-roleChange"
      placement="bottom-start"
      description="A dropdown to change the user role"
      body={({ toggleVisibility }) => (
        <ClickOutside onClickOutside={toggleVisibility}>
          <Dropdown>
            {Object.keys(GQLUSER_ROLE).map((r: GQLUSER_ROLE_RL) => (
              <TranslatedRole
                key={r}
                container={
                  <DropdownButton
                    onClick={() => {
                      props.onChangeRole(r);
                      toggleVisibility();
                    }}
                  >
                    dummy
                  </DropdownButton>
                }
              >
                {r}
              </TranslatedRole>
            ))}
          </Dropdown>
        </ClickOutside>
      )}
    >
      {({ toggleVisibility, ref, visible }) => (
        <Localized
          id="community-changeRoleButton"
          attrs={{ "aria-label": true }}
        >
          <Button
            aria-label="Change role"
            className={styles.button}
            onClick={toggleVisibility}
            ref={ref}
            variant="regular"
            size="small"
          >
            <UserRoleText>{props.role}</UserRoleText>
            {
              <ButtonIcon size="lg">
                {visible ? "arrow_drop_up" : "arrow_drop_down"}
              </ButtonIcon>
            }
          </Button>
        </Localized>
      )}
    </Popover>
  </Localized>
);

export default UserRoleChange;
