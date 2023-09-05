import cn from "classnames";
import React, { ComponentType, FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { SvgIcon } from "coral-ui/components/icons";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";

import styles from "./DiscussionsHeader.css";

interface Props {
  header: React.ReactNode;
  subHeader: React.ReactNode;
  Icon: ComponentType;
}

const DiscussionsHeader: FunctionComponent<Props> = ({
  header,
  subHeader,
  Icon,
}) => {
  return (
    <HorizontalGutter spacing={1} className={styles.root}>
      <Flex spacing={1} alignItems="center">
        <SvgIcon size="md" Icon={Icon} />
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
