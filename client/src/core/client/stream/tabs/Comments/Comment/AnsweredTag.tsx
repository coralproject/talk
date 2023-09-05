import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { CheckIcon, SvgIcon } from "coral-ui/components/icons";
import { Flex, Tag } from "coral-ui/components/v2";

import styles from "./AnsweredTag.css";

interface Props {
  collapsed?: boolean;
}

const AnsweredTag: FunctionComponent<Props> = ({ collapsed }) => {
  return collapsed ? (
    <SvgIcon className={styles.tagIcon} color="success" Icon={CheckIcon} />
  ) : (
    <Tag variant="regular" color="primary" className={styles.answeredTag}>
      <Flex alignItems="center">
        <SvgIcon
          className={styles.tagIcon}
          color="success"
          size="xs"
          Icon={CheckIcon}
        />
        <Localized id="qa-answered-tag">answered</Localized>
      </Flex>
    </Tag>
  );
};

export default AnsweredTag;
