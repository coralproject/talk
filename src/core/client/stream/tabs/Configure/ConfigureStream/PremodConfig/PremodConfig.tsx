import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import ToggleConfig from "../ToggleConfig";
import WidthLimitedDescription from "../WidthLimitedDescription";

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
        id={input.name}
        disabled={disabled}
        {...input}
        title={
          <Localized id="configure-premod-title">
            <span>Pre-Moderation</span>
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
