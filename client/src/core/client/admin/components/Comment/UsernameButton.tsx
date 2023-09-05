import cn from "classnames";
import React, { FunctionComponent } from "react";

import { BaseButton } from "coral-ui/components/v2";

import Username from "./Username";

import styles from "./UsernameButton.css";

interface Props {
  username: string;
  className?: string;
  onClick: () => void;
}

const UsernameButton: FunctionComponent<Props> = ({
  username,
  onClick,
  className,
}) => {
  return (
    <BaseButton onClick={onClick} className={cn(styles.root, className)}>
      <Username>{username}</Username>
    </BaseButton>
  );
};

export default UsernameButton;
