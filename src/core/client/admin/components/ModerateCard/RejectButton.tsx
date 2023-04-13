import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { CloseIcon, SvgIcon } from "coral-ui/components/icons";
import { BaseButton } from "coral-ui/components/v2";

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
      <SvgIcon size="lg" className={styles.icon} Icon={CloseIcon} />
    </BaseButton>
  </Localized>
);

export default RejectButton;
