import React, { FunctionComponent } from "react";

import { Box, Flex, HorizontalGutter } from "coral-ui/components/v2";

import styles from "./ConfigBox.css";

interface Props {
  id?: string;
  topRight?: React.ReactElement<any>;
  title?: React.ReactNode;
  children: React.ReactNode;
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
}

const ConfigBox: FunctionComponent<Props> = ({
  id,
  title,
  topRight,
  children,
  container,
  ...rest
}) => {
  return (
    <Box
      container={container || "div"}
      {...rest}
      className={styles.root}
      id={id}
    >
      <Flex className={styles.title} justifyContent="space-between">
        <div>{title}</div>
        <div>{topRight}</div>
      </Flex>
      <div className={styles.content}>
        <HorizontalGutter container={container || "div"} spacing={4}>
          {children}
        </HorizontalGutter>
      </div>
    </Box>
  );
};

export default ConfigBox;
