import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { BaseButton, Icon } from "talk-ui/components";

import styles from "./RejectButton.css";

interface Props extends PropTypesOf<typeof BaseButton> {
  invert?: boolean;
}

const RejectButton: FunctionComponent<Props> = ({
  invert,
  className,
  ...rest
}) => (
  <Localized id="moderate-comment-rejectButton" attrs={{ "aria-label": true }}>
    <BaseButton
      {...rest}
      className={cn(className, styles.root, {
        [styles.invert]: invert,
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
