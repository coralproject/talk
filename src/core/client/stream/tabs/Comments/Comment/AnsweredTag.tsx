import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Icon, Tag } from "coral-ui/components/v2";

import styles from "./AnsweredTag.css";

interface Props {
  collapsed?: boolean;
}

const AnsweredTag: FunctionComponent<Props> = ({ collapsed }) => {
  return collapsed ? (
    <Icon className={styles.tagIcon}>check</Icon>
  ) : (
    <Tag variant="regular" color="primary" className={styles.answeredTag}>
      <Flex alignItems="center">
        <Icon size="xs" className={styles.tagIcon}>
          check
        </Icon>
        <Localized id="qa-answered-tag">answered</Localized>
      </Flex>
    </Tag>
  );
};

export default AnsweredTag;
