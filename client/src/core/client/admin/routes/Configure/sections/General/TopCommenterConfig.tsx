import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment TopCommenterConfig_formValues on Settings {
    topCommenter {
      enabled
    }
  }
`;

interface Props {
  disabled: boolean;
}

const TopCommenterConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-topCommenter-title">
        <Header container="h2">Top commenter</Header>
      </Localized>
    }
  >
    <Localized id="configure-general-topCommenter-explanation">
      <FormFieldDescription>
        Add top commenter badge to commenters with featured comments in the last
        10 days
      </FormFieldDescription>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-topCommenter-enabled">
        <Label component="legend">Top commenter</Label>
      </Localized>
      <OnOffField name="topCommenter.enabled" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default TopCommenterConfig;
