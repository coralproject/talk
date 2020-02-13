import React, { FunctionComponent } from "react";

import { BaseButton } from "coral-ui/components/v2";
import Username from "./Username";

import styles from "./UsernameButton.css";

interface Props {
  username: string;
  onClick: () => void;
}

const UsernameButton: FunctionComponent<Props> = ({ username, onClick }) => {
  return (
    <BaseButton onClick={onClick} className={styles.root}>
      <Username>{username}</Username>
    </BaseButton>
  );
};

export default UsernameButton;
