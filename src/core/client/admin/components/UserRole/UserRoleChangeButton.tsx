import cn from "classnames";
import React, { FunctionComponent } from "react";

import TranslatedRole from "coral-admin/components/TranslatedRole";
import { PropTypesOf } from "coral-framework/types";
import { ButtonIcon, DropdownButton } from "coral-ui/components/v2";

import styles from "./UserRoleChangeButton.css";

interface Props extends Omit<PropTypesOf<typeof TranslatedRole>, "container"> {
  active?: boolean;
  onClick: () => void;
  testID: string;
}

const UserRoleChangeButton: FunctionComponent<Props> = ({
  active,
  onClick,
  testID,
  ...props
}) => {
  return (
    <TranslatedRole
      container={
        <DropdownButton
          data-testid={testID}
          className={cn(active && styles.active)}
          onClick={onClick}
          adornment={
            props.scoped && active && <ButtonIcon>settings</ButtonIcon>
          }
        >
          dummy
        </DropdownButton>
      }
      {...props}
    />
  );
};

export default UserRoleChangeButton;
