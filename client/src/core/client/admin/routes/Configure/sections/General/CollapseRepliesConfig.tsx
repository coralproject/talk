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
  fragment CollapseRepliesConfig_formValues on Settings {
    collapseReplies
  }
`;

interface Props {
  disabled: boolean;
}

const CollapseRepliesConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-collapseReplies-title">
        <Header container="h2">Collapse replies</Header>
      </Localized>
    }
  >
    <Localized id="configure-general-collapseReplies-explanation">
      <FormFieldDescription>
        When enabled, top-level replies to comments will be collapsed by
        default.
      </FormFieldDescription>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-collapseReplies-enabled">
        <Label component="legend">Collapse replies enabled</Label>
      </Localized>
      <OnOffField name="collapseReplies" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default CollapseRepliesConfig;
