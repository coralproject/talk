import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { SvgIcon } from "coral-ui/components/icons";
import styles from "./BskyButton.css";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const bskyIcon: FunctionComponent = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 5.828125 5.230469 C 6.910156 6.042969 8.074219 7.6875 8.5 8.570312 C 8.925781 7.6875 10.089844 6.042969 11.171875 5.230469 C 11.949219 4.644531 13.214844 4.191406 13.214844 5.632812 C 13.214844 5.921875 13.050781 8.054688 12.953125 8.398438 C 12.617188 9.601562 11.390625 9.910156 10.296875 9.722656 C 12.207031 10.046875 12.691406 11.125 11.644531 12.199219 C 9.652344 14.238281 8.785156 11.6875 8.558594 11.03125 C 8.519531 10.910156 8.5 10.855469 8.5 10.902344 C 8.5 10.855469 8.480469 10.910156 8.441406 11.03125 C 8.214844 11.6875 7.347656 14.238281 5.355469 12.199219 C 4.308594 11.125 4.792969 10.046875 6.703125 9.722656 C 5.609375 9.910156 4.382812 9.601562 4.046875 8.398438 C 3.949219 8.054688 3.785156 5.921875 3.785156 5.632812 C 3.785156 4.191406 5.050781 4.644531 5.828125 5.230469 Z M 5.828125 5.230469 "
        fill="white"
      />
    </svg>
  );
};

const BskyButton: FunctionComponent<Props> = (props) => (
  <Button
    className={cn(CLASSES.login.bskyButton, styles.button)}
    variant="filled"
    color="none"
    fontSize="small"
    paddingSize="small"
    upperCase
    fullWidth
    type="submit"
  >
    <Flex alignItems="center" justifyContent="center">
      <SvgIcon size="md" className={styles.icon} Icon={bskyIcon} />
      <span>{props.children}</span>
    </Flex>
  </Button>
);

export default BskyButton;
