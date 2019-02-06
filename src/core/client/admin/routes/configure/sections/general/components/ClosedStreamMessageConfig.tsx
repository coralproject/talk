import { Localized } from "fluent-react/compat";
import React, { StatelessComponent, Suspense } from "react";
import { Field } from "react-final-form";

import {
  HorizontalGutter,
  Spinner,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import Header from "../../../components/Header";
import LazyMarkdown from "./LazyMarkdown";

interface Props {
  disabled: boolean;
}

const ClosedStreamMessageConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-general-closedStreamMessage-title">
      <Header>Closed Stream Message</Header>
    </Localized>
    <Localized
      id="configure-general-closedStreamMessage-explanation"
      strong={<strong />}
    >
      <Typography variant="detail">
        Write a message to appear after a story is closed for commenting.
      </Typography>
    </Localized>
    <Field name="closedMessage">
      {({ input, meta }) => (
        <>
          <Suspense fallback={<Spinner />}>
            <LazyMarkdown onChange={input.onChange} value={input.value} />
          </Suspense>
          {meta.touched &&
            (meta.error || meta.submitError) && (
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
