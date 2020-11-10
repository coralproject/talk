import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  MouseEventHandler,
} from "react";

import { Icon } from "coral-ui/components/v2";

import styles from "./StarRatingIcon.css";

interface Props {
  id?: string;
  value: number;
  checked: boolean;
  filled: boolean;
  name?: string;
  readOnly?: boolean;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClick?: MouseEventHandler<HTMLInputElement>;
}

const StarRatingIcon: FunctionComponent<Props> = ({
  id,
  value,
  filled,
  readOnly = false,
  ...props
}) => {
  const container = (
    // QUESTION: (wyattjoh) this doesn't seem to work...
    <Localized id="framework-starRating" $value={value}>
      <Icon
        className={cn(styles.icons, !readOnly && styles.interactive)}
        tabIndex={value}
        aria-label={`${value} Star`}
        size="lg"
      >
        {filled ? "star" : "star_border"}
      </Icon>
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
