import cn from "classnames";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { BaseButton, Icon } from "talk-ui/components";

import styles from "./AcceptButton.css";

interface Props extends PropTypesOf<typeof BaseButton> {
  invert?: boolean;
}

const AcceptButton: StatelessComponent<Props> = ({
  invert,
  className,
  ...rest
}) => (
  <BaseButton
    {...rest}
    className={cn(className, styles.root, {
      [styles.invert]: invert,
    })}
  >
    <Icon size="lg" className={styles.icon}>
      done
    </Icon>
  </BaseButton>
);

export default AcceptButton;
