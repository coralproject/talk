import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Markdown } from "coral-framework/components";
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
          <Markdown className={styles.text}>{props.children}</Markdown>
        </Flex>
        <Button color="light" onClick={props.onClose}>
          <Icon>close</Icon>
        </Button>
      </Flex>
    </div>
  );
};

export default Announcement;
