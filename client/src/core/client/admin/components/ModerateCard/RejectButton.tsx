import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import {
  ArrowsDownIcon,
  ArrowsUpIcon,
  RemoveIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import { BaseButton } from "coral-ui/components/v2";

import styles from "./RejectButton.css";

interface Props extends Omit<PropTypesOf<typeof BaseButton>, "ref"> {
  toggle?: boolean;
  open?: boolean;
  invert?: boolean;
  readOnly?: boolean;
}

const RejectButton: FunctionComponent<Props> = ({
  invert,
  readOnly,
  className,
  open = false,
  toggle = false,
  ...rest
}) => (
  <Localized id="moderate-comment-rejectButton" attrs={{ "aria-label": true }}>
    <BaseButton
      {...rest}
      className={cn(className, styles.root, {
        [styles.open]: toggle && open,
        [styles.invert]: invert,
        [styles.readOnly]: readOnly,
      })}
      aria-label="Reject"
    >
      <SvgIcon size="lg" className={styles.xIcon} Icon={RemoveIcon} />
      {toggle && (
        <SvgIcon
          size="xxs"
          className={styles.arrowIcon}
          Icon={open ? ArrowsUpIcon : ArrowsDownIcon}
        />
      )}
    </BaseButton>
  </Localized>
);

export default RejectButton;
