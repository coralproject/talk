import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { MarkdownEditor } from "coral-framework/components/loadables";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import { FormFieldDescription, Spinner } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ClosedStreamMessageConfig_formValues on Settings {
    closeCommenting {
      message
    }
  }
`;

interface Props {
  disabled: boolean;
}

const ClosedStreamMessageConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-closedStreamMessage-title">
        <Header htmlFor="configure-general-closedStreamMessage-content">
          Closed comment stream message
        </Header>
      </Localized>
    }
  >
    <Localized
      id="configure-general-closedStreamMessage-explanation"
      elems={{ strong: <strong /> }}
    >
      <FormFieldDescription>
        Write a message to appear after a story is closed for commenting.
      </FormFieldDescription>
    </Localized>
    <Field name="closeCommenting.message" parse={parseEmptyAsNull}>
      {({ input, meta }) => (
        <>
          <Suspense fallback={<Spinner />}>
            <MarkdownEditor
              {...input}
              id="configure-general-closedStreamMessage-content"
            />
          </Suspense>
          <ValidationMessage meta={meta} fullWidth />
        </>
      )}
    </Field>
  </ConfigBox>
);

export default ClosedStreamMessageConfig;
