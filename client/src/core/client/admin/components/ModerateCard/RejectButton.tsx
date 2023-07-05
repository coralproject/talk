import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { BaseButton, Icon } from "coral-ui/components/v2";

import styles from "./RejectButton.css";

interface Props extends Omit<PropTypesOf<typeof BaseButton>, "ref"> {
  invert?: boolean;
  readOnly?: boolean;
}

const RejectButton: FunctionComponent<Props> = ({
  invert,
  readOnly,
  className,
  ...rest
}) => (
  <Localized id="moderate-comment-rejectButton" attrs={{ "aria-label": true }}>
    <BaseButton
      {...rest}
      className={cn(className, styles.root, {
        [styles.invert]: invert,
        [styles.readOnly]: readOnly,
      })}
      aria-label="Reject"
    >
      <Icon size="lg" className={styles.icon}>
        close
      </Icon>
    </BaseButton>
  </Localized>
);

export default RejectButton;
