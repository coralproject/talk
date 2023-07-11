import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { CheckIcon, SvgIcon } from "coral-ui/components/icons";
import { BaseButton } from "coral-ui/components/v2";

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
}) => {
  const props: PropTypesOf<typeof BaseButton> = {
    ...rest,
    className: cn(className, styles.root, {
      [styles.checked]: checked,
      [styles.readOnly]: readOnly,
    }),
    disabled: readOnly,
  };

  if (checked) {
    return (
      <Localized
        id="moderate-forReview-reviewedButton"
        attrs={{ "aria-label": true }}
      >
        <BaseButton {...props} aria-label="Reviewed">
          <SvgIcon
            Icon={CheckIcon}
            size="xxs"
            className={styles.icon}
            strokeWidth="bold"
          />
        </BaseButton>
      </Localized>
    );
  }
  return (
    <Localized
      id="moderate-forReview-markAsReviewedButton"
      attrs={{ "aria-label": true }}
    >
      <BaseButton {...props} aria-label="Mark as reviewed" />
    </Localized>
  );
};

export default ReviewButton;
