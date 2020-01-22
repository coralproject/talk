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

type ModeType = "COMMENTS" | "QA";

const MODES_MAP: Record<ModeType, string> = {
  COMMENTS: "Comments",
  QA: "Q&A",
};

const StreamMode: FunctionComponent<Props> = ({ disabled }) => (
  <Field name="mode">
    {({ input }) => (
      <>
        <Typography variant="heading3" container="div">
          <Localized id="configure-mode-title">
            <span>Stream Mode</span>
          </Localized>
        </Typography>
        <SelectField {...input} id={input.name} disabled={disabled}>
          {Object.keys(MODES_MAP).map((mode: ModeType) => {
            return (
              <Option value={mode} key={mode}>
                {MODES_MAP[mode]}
              </Option>
            );
          })}
        </SelectField>
      </>
    )}
  </Field>
);

export default StreamMode;
