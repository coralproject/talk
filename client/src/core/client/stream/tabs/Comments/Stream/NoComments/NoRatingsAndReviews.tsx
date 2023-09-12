import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { GQLTAG } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { CallOut } from "coral-ui/components/v2";

interface Props {
  isClosed: boolean;
  tag?: GQLTAG;
}

const NoRatingsAndReviews: FunctionComponent<Props> = ({ isClosed, tag }) => {
  if (isClosed) {
    if (tag === GQLTAG.REVIEW) {
      return (
        <Localized id="ratingsAndReviews-noReviewsAtAll">
          <CallOut fullWidth>There are no reviews.</CallOut>
        </Localized>
      );
    }

    if (tag === GQLTAG.QUESTION) {
      return (
        <Localized id="ratingsAndReviews-noQuestionsAtAll">
          <CallOut fullWidth>There are no questions.</CallOut>
        </Localized>
      );
    }

    return null;
  }

  if (tag === GQLTAG.REVIEW) {
    return (
      <Localized id="ratingsAndReviews-noReviewsYet">
        <CallOut fullWidth>
          There are no reviews yet. Why don't you write one?
        </CallOut>
      </Localized>
    );
  }

  if (tag === GQLTAG.QUESTION) {
    return (
      <Localized id="ratingsAndReviews-noQuestionsYet">
        <CallOut fullWidth className={CLASSES.ratingsAndReview.noReviews}>
          There are no questions yet. Why don't you ask one?
        </CallOut>
      </Localized>
    );
  }

  return null;
};

export default NoRatingsAndReviews;
