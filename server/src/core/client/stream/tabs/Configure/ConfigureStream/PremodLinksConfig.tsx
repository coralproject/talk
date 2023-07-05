import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { parseBool } from "coral-framework/lib/form";

import ToggleConfig from "./ToggleConfig";
import WidthLimitedDescription from "./WidthLimitedDescription";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment PremodLinksConfig_formValues on StorySettings {
    premodLinksEnable
  }
`;

interface Props {
  disabled: boolean;
}

const PremodLinksConfig: FunctionComponent<Props> = ({ disabled }) => (
  <Field name="premodLinksEnable" type="checkbox" parse={parseBool}>
    {({ input }) => (
      <ToggleConfig
        {...input}
        id={input.name}
        disabled={disabled}
        title={
          <Localized id="configure-premodLink-commentsContainingLinks">
            <span>Pre-moderate comments containing links</span>
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
