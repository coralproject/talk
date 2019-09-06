import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";

import { MarkdownEditor } from "coral-framework/components/loadables";
import { HorizontalGutter, Spinner, Typography } from "coral-ui/components";

import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const ClosedStreamMessageConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-general-closedStreamMessage-title">
      <Header
        container={
          <label htmlFor="configure-general-closedStreamMessage-content" />
        }
      >
        Closed comment stream message
      </Header>
    </Localized>
    <Localized
      id="configure-general-closedStreamMessage-explanation"
      strong={<strong />}
    >
      <Typography variant="bodyShort">
        Write a message to appear after a story is closed for commenting.
      </Typography>
    </Localized>
    <Field name="closeCommenting.message">
      {({ input, meta }) => (
        <>
          <Suspense fallback={<Spinner />}>
            <MarkdownEditor
              id="configure-general-closedStreamMessage-content"
              {...input}
            />
          </Suspense>
          <ValidationMessage meta={meta} fullWidth />
        </>
      )}
    </Field>
  </HorizontalGutter>
);

export default ClosedStreamMessageConfig;
