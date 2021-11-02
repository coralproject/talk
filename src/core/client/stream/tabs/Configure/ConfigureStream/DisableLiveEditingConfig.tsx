import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { parseBool } from "coral-framework/lib/form";

import ToggleConfig from "./ToggleConfig";
import WidthLimitedDescription from "./WidthLimitedDescription";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment DisableLiveEditingConfig_formValues on StorySettings {
    disableLiveEditing
  }
`;

interface Props {
  disabled: boolean;
}

const DisableLiveEditingConfig: FunctionComponent<Props> = ({ disabled }) => (
  <Field name="disableLiveEditing" type="checkbox" parse={parseBool}>
    {({ input }) => (
      <ToggleConfig
        {...input}
        id={input.name}
        disabled={disabled}
        title={
          <Localized id="configure-disableLiveEditing-title">
            <span>Disable live editing</span>
          </Localized>
        }
      >
        <Localized id="configure-disableLiveEditing-description">
          <WidthLimitedDescription>
            Disables edits from showing up as they are submitted by the user to
            the stream.
          </WidthLimitedDescription>
        </Localized>
      </ToggleConfig>
    )}
  </Field>
);

export default DisableLiveEditingConfig;
