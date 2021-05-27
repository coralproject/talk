import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { BaseButton, Icon } from "coral-ui/components/v2";

import styles from "./ReviewButton.css";

interface Props extends Omit<PropTypesOf<typeof BaseButton>, "ref"> {
  checked?: boolean;
  readOnly?: boolean;
}

const ReviewButton: FunctionComponent<Props> = ({
  checked,
  readOnly,
  className,
  ...rest
}) => (
  <Localized
    id="moderate-forReview-reviewButton"
    attrs={{ "aria-label": true }}
  >
    <BaseButton
      {...rest}
      className={cn(className, styles.root, {
        [styles.checked]: checked,
        [styles.readOnly]: readOnly,
      })}
      aria-label="Mark as reviewed"
      disabled={readOnly}
    >
      {checked && (
        <Icon size="xs" className={styles.icon}>
          done
        </Icon>
      )}
    </BaseButton>
  </Localized>
);

export default ReviewButton;
