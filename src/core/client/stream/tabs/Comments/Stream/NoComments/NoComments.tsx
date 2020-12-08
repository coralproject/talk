import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { GQLSTORY_MODE, GQLTAG } from "coral-framework/schema";
import { CallOut } from "coral-ui/components/v2";

import NoQuestionAndAnswers from "./NoQuestionAndAnswers";
import NoRatingsAndReviews from "./NoRatingsAndReviews";

interface Props {
  mode:
    | "COMMENTS"
    | "QA"
    | "RATINGS_AND_REVIEWS"
    | "%future added value"
    | null;
  isClosed: boolean;
  tag?: GQLTAG;
}

const NoComments: FunctionComponent<Props> = ({ mode, isClosed, tag }) => {
  switch (mode) {
    case GQLSTORY_MODE.COMMENTS:
      if (isClosed) {
        return (
          <Localized id="comments-noCommentsAtAll">
            <CallOut fullWidth>There are no comments on this story.</CallOut>
          </Localized>
        );
      }

      return (
        <Localized id="comments-noCommentsYet">
          <CallOut fullWidth>
            There are no comments yet. Why don't you write one?
          </CallOut>
        </Localized>
      );

    case GQLSTORY_MODE.QA:
      return <NoQuestionAndAnswers isClosed={isClosed} />;

    case GQLSTORY_MODE.RATINGS_AND_REVIEWS:
      return <NoRatingsAndReviews isClosed={isClosed} tag={tag} />;

    default:
      return null;
  }
};

export default NoComments;
