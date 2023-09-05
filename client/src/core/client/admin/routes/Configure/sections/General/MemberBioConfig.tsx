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
  fragment MemberBioConfig_formValues on Settings {
    memberBios
  }
`;

interface Props {
  disabled: boolean;
}

const MemberBioConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-memberBio-title">
        <Header container={<legend />}>Commenter bios</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized
      id="configure-general-memberBio-explanation"
      elems={{ strong: <strong /> }}
    >
      <FormFieldDescription>
        Allow commenters to add a bio to their profile. Note: this can increase
        moderator time as commenter bios can be reported.
      </FormFieldDescription>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-memberBio-label">
        <Label component="legend">Allow commenter bios</Label>
      </Localized>
      <OnOffField name="memberBios" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default MemberBioConfig;
