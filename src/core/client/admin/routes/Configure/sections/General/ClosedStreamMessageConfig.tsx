import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";

import { MarkdownEditor } from "coral-framework/components/loadables";
import {
  HorizontalGutter,
  Spinner,
  Typography,
  ValidationMessage,
} from "coral-ui/components";

import Header from "../../Header";

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
        Closed Stream Message
      </Header>
    </Localized>
    <Localized
      id="configure-general-closedStreamMessage-explanation"
      strong={<strong />}
    >
      <Typography variant="detail">
        Write a message to appear after a story is closed for commenting.
      </Typography>
    </Localized>
    <Field name="closeCommenting.message">
      {({ input, meta }) => (
        <>
          <Suspense fallback={<Spinner />}>
            <MarkdownEditor
              id="configure-general-closedStreamMessage-content"
              name={input.name}
              onChange={input.onChange}
              value={input.value}
            />
          </Suspense>
          {meta.touched && (meta.error || meta.submitError) && (
            <ValidationMessage>
              {meta.error || meta.submitError}
            </ValidationMessage>
          )}
        </>
      )}
    </Field>
  </HorizontalGutter>
);

export default ClosedStreamMessageConfig;
