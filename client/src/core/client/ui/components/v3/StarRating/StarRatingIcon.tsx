import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  ChangeEventHandler,
  ComponentType,
  FocusEventHandler,
  FunctionComponent,
  MouseEventHandler,
} from "react";

import CLASSES from "coral-stream/classes";
import { SvgIcon } from "coral-ui/components/icons";

import styles from "./StarRatingIcon.css";

interface Props {
  id?: string;
  value: number;
  checked: boolean;
  Icon: ComponentType;
  name?: string;
  readOnly?: boolean;
  filled?: boolean;
  size?: "xl" | "lg";
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
}

const StarRatingIcon: FunctionComponent<Props> = ({
  id,
  value,
  readOnly = false,
  size = "lg",
  Icon,
  filled,
  ...props
}) => {
  const container = (
    <Localized
      id="framework-starRating"
      vars={{ value }}
      attrs={{ "aria-label": true }}
    >
      <SvgIcon
        Icon={Icon}
        filled={filled}
        className={cn(
          styles.icons,
          !readOnly && styles.interactive,
          CLASSES.ratingsAndReview.stars.icon
        )}
        tab-index={value}
        aria-label={`${value} Star`}
        size={size}
      />
    </Localized>
  );

  if (readOnly) {
    return <span>{container}</span>;
  }

  return (
    <>
      <label htmlFor={id}>{container}</label>
      <input
        id={id}
        className={styles.visuallyhidden}
        value={value}
        type="radio"
        {...props}
      />
    </>
  );
};

export default StarRatingIcon;
