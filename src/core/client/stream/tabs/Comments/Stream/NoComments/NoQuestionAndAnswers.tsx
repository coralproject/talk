import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { CallOut } from "coral-ui/components/v2";

interface Props {
  isClosed: boolean;
}

const NoQuestionAndAnswers: FunctionComponent<Props> = ({ isClosed }) => {
  if (isClosed) {
    return (
      <Localized id="qa-noQuestionsAtAll">
        <CallOut fullWidth>There are no questions on this story.</CallOut>
      </Localized>
    );
  }

  return (
    <Localized id="qa-noQuestionsYet">
      <CallOut fullWidth>
        There are no questions yet. Why don't you ask one?
      </CallOut>
    </Localized>
  );
};

export default NoQuestionAndAnswers;
