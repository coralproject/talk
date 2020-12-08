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

interface Props {
  disabled: boolean;
}

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment PremoderateSuspectWordsConfig_settings on Settings {
    premoderateSuspectWords
  }
`;

const PremodSuspectWordsConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-wordList-premodSuspectWords-title">
          <Header container="legend">
            Pre-moderate comments containing suspect words
          </Header>
        </Localized>
      }
    >
      <Localized id="configure-moderation-newCommenters-description">
        <FormFieldDescription>
          When this is active, any comments containing a suspect word will be
          sent to pre-moderation to be reviewed before being allowed into the
          comment stream.
        </FormFieldDescription>
      </Localized>
      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-premodSuspectWords-enable">
          <Label component="legend">Enable suspect words pre-moderation</Label>
        </Localized>
        <OnOffField name="premoderateSuspectWords" disabled={disabled} />
      </FormField>
    </ConfigBox>
  );
};

export default PremodSuspectWordsConfig;
