import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { BaseButton, Icon } from "coral-ui/components";

import styles from "./AcceptButton.css";

interface Props extends PropTypesOf<typeof BaseButton> {
  invert?: boolean;
}

const AcceptButton: FunctionComponent<Props> = ({
  invert,
  className,
  ...rest
}) => (
  <Localized id="moderate-comment-acceptButton" attrs={{ "aria-label": true }}>
    <BaseButton
      {...rest}
      className={cn(className, styles.root, {
        [styles.invert]: invert,
      })}
      aria-label="Accept"
    >
      <Icon size="lg" className={styles.icon}>
        done
      </Icon>
    </BaseButton>
  </Localized>
);

export default AcceptButton;
