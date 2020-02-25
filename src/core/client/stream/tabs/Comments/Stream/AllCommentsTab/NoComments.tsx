import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { GQLSTORY_MODE } from "coral-framework/schema";
import { CallOut } from "coral-ui/components";

interface Props {
  mode: "COMMENTS" | "QA" | "%future added value";
  isClosed: boolean;
}

const NoComments: FunctionComponent<Props> = ({ mode, isClosed }) => {
  if (mode === GQLSTORY_MODE.COMMENTS) {
    if (isClosed) {
      return (
        <Localized id="comments-noCommentsAtAll">
          <CallOut fullWidth>There are no comments on this story.</CallOut>
        </Localized>
      );
    } else {
      return (
        <Localized id="comments-noCommentsYet">
          <CallOut fullWidth>
            There are no comments yet. Why don't you write one?
          </CallOut>
        </Localized>
      );
    }
  } else if (mode === GQLSTORY_MODE.QA) {
    if (isClosed) {
      return (
        <Localized id="qa-noQuestionsAtAll">
          <CallOut fullWidth>There are no questions on this story.</CallOut>
        </Localized>
      );
    } else {
      return (
        <Localized id="qa-noQuestionsYet">
          <CallOut fullWidth>
            There are no questions yet. Why don't you ask one?
          </CallOut>
        </Localized>
      );
    }
  }

  return null;
};

export default NoComments;
