import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";

import { MarkdownEditor } from "coral-framework/components/loadables";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import { HorizontalGutter, Spinner } from "coral-ui/components";

import Description from "../../Description";
import Header from "../../Header";
import SectionContent from "../../SectionContent";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const ClosedStreamMessageConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-general-closedStreamMessage-title">
      <Header htmlFor="configure-general-closedStreamMessage-content">
        Closed comment stream message
      </Header>
    </Localized>

    <SectionContent>
      <Localized
        id="configure-general-closedStreamMessage-explanation"
        strong={<strong />}
      >
        <Description>
          Write a message to appear after a story is closed for commenting.
        </Description>
      </Localized>
      <Field name="closeCommenting.message" parse={parseEmptyAsNull}>
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
    </SectionContent>
  </HorizontalGutter>
);

export default ClosedStreamMessageConfig;
