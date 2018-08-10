import React, { StatelessComponent } from "react";
import { Flex, Typography } from "talk-ui/components";
import * as styles from "./PoweredBy.css";

const PoweredBy: StatelessComponent = props => {
  return (
    <Flex itemGutter="half">
      <Typography className={styles.text} variant="bodyCopy">
        Powered by
      </Typography>
      <Typography className={styles.text} variant="heading4">
        The Coral Project
      </Typography>
    </Flex>
  );
};

export default PoweredBy;
