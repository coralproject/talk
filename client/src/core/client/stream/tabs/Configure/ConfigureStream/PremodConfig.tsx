import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import ToggleConfig from "./ToggleConfig";
import WidthLimitedDescription from "./WidthLimitedDescription";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment PremodConfig_formValues on StorySettings {
    moderation
  }
`;

interface Props {
  disabled: boolean;
}

const parse = (v: boolean) => {
  return v ? "PRE" : "POST";
};

const format = (v: "PRE" | "POST") => {
  return v === "PRE";
};

const PremodConfig: FunctionComponent<Props> = ({ disabled }) => (
  <Field name="moderation" type="checkbox" parse={parse} format={format}>
    {({ input }) => (
      <ToggleConfig
        {...input}
        id={input.name}
        disabled={disabled}
        title={
          <Localized id="configure-premod-premoderateAllComments">
            <span>Pre-moderate all comments</span>
          </Localized>
        }
      >
        <Localized id="configure-premod-description">
          <WidthLimitedDescription>
            Moderators must approve any comment before it is published to this
            stream.
          </WidthLimitedDescription>
        </Localized>
      </ToggleConfig>
    )}
  </Field>
);

export default PremodConfig;
