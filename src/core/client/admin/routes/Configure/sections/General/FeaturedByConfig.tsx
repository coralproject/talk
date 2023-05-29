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
  fragment FeaturedByConfig_formValues on Settings {
    featuredBy
  }
`;

interface Props {
  disabled: boolean;
}

const FeaturedByConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-featuredBy-title">
        <Header container="h2">Featured by</Header>
      </Localized>
    }
  >
    <Localized id="configure-general-featuredBy-explanation">
      <FormFieldDescription>
        Add moderator name to featured comment display
      </FormFieldDescription>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-featuredBy-enabled">
        <Label component="legend">Featured by</Label>
      </Localized>
      <OnOffField name="featuredBy" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default FeaturedByConfig;
