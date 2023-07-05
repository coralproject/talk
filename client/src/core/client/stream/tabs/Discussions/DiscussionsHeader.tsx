import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex, HorizontalGutter, Icon } from "coral-ui/components/v2";

import styles from "./DiscussionsHeader.css";

interface Props {
  header: React.ReactNode;
  subHeader: React.ReactNode;
  icon: string;
}

const DiscussionsHeader: FunctionComponent<Props> = ({
  header,
  subHeader,
  icon,
}) => {
  return (
    <HorizontalGutter spacing={1} className={styles.root}>
      <Flex spacing={1} alignItems="center">
        <Icon size="md">{icon}</Icon>
        <h2 className={cn(styles.header, CLASSES.discussions.header)}>
          {header}
        </h2>
      </Flex>

      <div className={cn(styles.subHeader, CLASSES.discussions.subHeader)}>
        {subHeader}
      </div>
    </HorizontalGutter>
  );
};

export default DiscussionsHeader;
