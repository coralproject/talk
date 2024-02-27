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
  fragment NewCommenterConfig_formValues on Settings {
    newCommenter {
      enabled
    }
  }
`;

interface Props {
  disabled: boolean;
}

const NewCommenterConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-newCommenter-title">
        <Header container="h2">New commenter</Header>
      </Localized>
    }
  >
    <Localized id="configure-general-newCommenter-explanation">
      <FormFieldDescription>
        Add [icon] badge to commenters who created their accounts in the past
        seven days.
      </FormFieldDescription>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-newCommenter-enabled">
        <Label component="legend">New commenter</Label>
      </Localized>
      <OnOffField name="newCommenter.enabled" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default NewCommenterConfig;
