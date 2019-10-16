import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";

import ToggleConfig from "../ToggleConfig";
import WidthLimitedDescription from "../WidthLimitedDescription";

interface Props {
  disabled: boolean;
}

const PremodLinksConfig: FunctionComponent<Props> = ({ disabled }) => (
  <Field name="premodLinksEnable" type="checkbox" parse={parseBool}>
    {({ input }) => (
      <ToggleConfig
        id={input.name}
        {...input}
        disabled={disabled}
        title={
          <Localized id="configure-premodLink-title">
            <span>Pre-Moderate Comments Containing Links</span>
          </Localized>
        }
      >
        <Localized id="configure-premodLink-description">
          <WidthLimitedDescription>
            Moderators must approve any comment that contains a link before it
            is published to this stream.
          </WidthLimitedDescription>
        </Localized>
      </ToggleConfig>
    )}
  </Field>
);

export default PremodLinksConfig;
