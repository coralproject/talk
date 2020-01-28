import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Icon } from "coral-ui/components";

import styles from "./Announcement.css";

interface Props {
  children: string;
  onClose: () => void;
}

const Announcement: FunctionComponent<Props> = props => {
  return (
    <div className={cn(styles.root, CLASSES.announcement)}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex itemGutter>
          <Icon size="lg">notifications</Icon>
          <span className={styles.text}>{props.children}</span>
        </Flex>
        <Button color="light" onClick={props.onClose}>
          <Icon>close</Icon>
        </Button>
      </Flex>
    </div>
  );
};

export default Announcement;
