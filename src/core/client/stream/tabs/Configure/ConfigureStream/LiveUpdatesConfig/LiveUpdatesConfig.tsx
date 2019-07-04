import { parseBool } from "coral-framework/lib/form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import ToggleConfig from "../ToggleConfig";
import WidthLimitedDescription from "../WidthLimitedDescription";

interface Props {
  disabled: boolean;
}

const LiveUpdatesConfig: FunctionComponent<Props> = ({ disabled }) => (
  <Field name="live.enabled" type="checkbox" parse={parseBool}>
    {({ input }) => (
      <ToggleConfig
        id={input.name}
        name={input.name}
        onChange={input.onChange}
        onFocus={input.onFocus}
        onBlur={input.onBlur}
        checked={input.checked}
        disabled={disabled}
        title={
          <Localized id="configure-liveUpdates-title">
            <span>Enable Live Updates for this Story</span>
          </Localized>
        }
      >
        <Localized id="configure-liveUpdates-description">
          <WidthLimitedDescription>
            When enabled, there will be real-time loading and updating of
            comments as new comments and replies are published.
          </WidthLimitedDescription>
        </Localized>
      </ToggleConfig>
    )}
  </Field>
);

export default LiveUpdatesConfig;
