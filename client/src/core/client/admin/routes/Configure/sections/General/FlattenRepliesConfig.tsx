import { Localized } from "@fluent/react/compat";
import {
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";
import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment FlattenRepliesConfig_formValues on Settings {
    flattenReplies
  }
`;

interface Props {
  disabled: boolean;
}

const FlattenRepliesConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-flattenReplies-title">
        <Header container="h2">Flatten replies</Header>
      </Localized>
    }
  >
    <Localized id="configure-general-flattenReplies-explanation">
      <FormFieldDescription>
        Change how levels of replies display. When enabled, replies to comments\
        can go up to seven levels deep before they are no longer indented on
        the\ page. When disabled, after a depth of seven replies, the rest of
        the\ conversation is displayed in a dedicated view away from the other\
        comments.
      </FormFieldDescription>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-flattenReplies-enabled">
        <Label component="legend">Flatten replies</Label>
      </Localized>
      <OnOffField name="flattenReplies" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default FlattenRepliesConfig;
