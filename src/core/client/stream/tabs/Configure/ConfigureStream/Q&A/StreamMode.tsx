import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { Typography } from "coral-ui/components";
import { Option, SelectField } from "coral-ui/components/v2";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment StreamMode_formValues on StorySettings {
    mode
  }
`;

interface Props {
  disabled: boolean;
}

const StreamMode: FunctionComponent<Props> = ({ disabled }) => (
  <Field name="mode">
    {({ input }) => (
      <>
        <Typography variant="heading3" container="div">
          <Localized id="configure-mode-title">
            <span>Stream Type</span>
          </Localized>
        </Typography>
        <Localized
          id="configure-mode-selectField"
          attrs={{ "aria-label": true }}
        >
          <SelectField
            aria-label="Select stream type"
            {...input}
            id={input.name}
            disabled={disabled}
          >
            <Localized id="configure-mode-option-qa">
              <Option value={"QA"}>Q&A</Option>
            </Localized>
            <Localized id="configure-mode-option-comments">
              <Option value={"COMMENTS"}>Comments</Option>
            </Localized>
            })}
          </SelectField>
        </Localized>
      </>
    )}
  </Field>
);

export default StreamMode;
