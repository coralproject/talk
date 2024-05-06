import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  FieldSet,
  FormField,
  FormFieldHeader,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment UnmoderatedCountsConfig_formValues on Settings {
    showUnmoderatedCounts
  }
`;

interface Props {
  disabled: boolean;
}

const UnmoderatedCountsConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-moderation-unmoderatedCounts-title">
          <Header container={<legend />}>Unmoderated counts</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      <FormField container={<FieldSet />}>
        <FormFieldHeader>
          <Localized id="configure-moderation-unmoderatedCounts-enabled">
            <Label component="legend">
              Show the number of unmoderated comments in the queue
            </Label>
          </Localized>
        </FormFieldHeader>
        <OnOffField name="showUnmoderatedCounts" disabled={disabled} />
      </FormField>
    </ConfigBox>
  );
};

export default UnmoderatedCountsConfig;
