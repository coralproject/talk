import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Option, SelectField } from "coral-ui/components/v2";

import styles from "./RatingsFilterMenu.css";

interface Props {
  rating: number | null;
  onChangeRating: (rating: number | null) => void;
}

type Value = "ALL" | "1" | "2" | "3" | "4" | "5";

function parseValue(value: Value): number | null {
  if (value === "ALL") {
    return null;
  }

  return parseInt(value, 10);
}

function formatRating(rating: number | null): Value {
  if (!rating) {
    return "ALL";
  }

  return rating.toString() as Value;
}

const RatingsFilterMenu: FunctionComponent<Props> = ({
  rating,
  onChangeRating,
}) => {
  const value = formatRating(rating);
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const parsed = parseValue(event.target.value as Value);
    if (parsed === rating) {
      return;
    }

    onChangeRating(parsed);
  };

  return (
    <SelectField
      id="coral-comments-ratingsFilterMenu"
      className={cn(styles.root, CLASSES.ratingsAndReview.ratingsFilter)}
      value={value}
      onChange={onChange}
      classes={{
        selectFont: styles.selectFont,
        selectColor: styles.selectColor,
      }}
      fullWidth
    >
      <Localized id="ratingsAndReviews-allReviewsFilter">
        <Option value="ALL">All reviews</Option>
      </Localized>
      <Localized id="ratingsAndReviews-starReviewsFilter" vars={{ rating: 5 }}>
        <Option value="5">5 Stars</Option>
      </Localized>
      <Localized id="ratingsAndReviews-starReviewsFilter" vars={{ rating: 4 }}>
        <Option value="4">4 Stars</Option>
      </Localized>
      <Localized id="ratingsAndReviews-starReviewsFilter" vars={{ rating: 3 }}>
        <Option value="3">3 Stars</Option>
      </Localized>
      <Localized id="ratingsAndReviews-starReviewsFilter" vars={{ rating: 2 }}>
        <Option value="2">2 Stars</Option>
      </Localized>
      <Localized id="ratingsAndReviews-starReviewsFilter" vars={{ rating: 1 }}>
        <Option value="1">1 Star</Option>
      </Localized>
    </SelectField>
  );
};

export default RatingsFilterMenu;
