import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { useField } from "react-final-form";

import { required } from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import { Typography } from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import styles from "./RatingInput.css";

interface Props {
  disabled?: boolean;
}

const RatingInput: FunctionComponent<Props> = ({ disabled }) => {
  const {
    input: { value = 0, onChange, name },
  } = useField<number>("rating", { validate: required });

  return (
    <div className={cn(styles.root, disabled && styles.disabled)}>
      <Localized id="ratingsAndReviews-selectARating">
        <Typography
          color="textDark"
          variant="bodyCopyBold"
          className={cn(styles.copy, CLASSES.ratingsAndReview.input.title)}
        >
          Select a rating
        </Typography>
      </Localized>
      <StarRating name={name} rating={value} size="xl" onRate={onChange} />
    </div>
  );
};

export default RatingInput;
