import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { FieldSet, FormField, HelperText, Label } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import DSAMethodOfRedressOptions from "./DSAMethodOfRedressOptions";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment DSAConfigContainer_formValues on Settings {
    dsa {
      enabled
      methodOfRedress
    }
  }
`;

interface Props {
  disabled: boolean;
}

export const DSAConfigContainer: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <ConfigBox
      data-testid="configure-general-dsaConfig"
      title={
        <Localized id="configure-general-dsaConfig-title">
          <Header container="h2">Digital services act</Header>
        </Localized>
      }
    >
      <FormField container={<FieldSet />}>
        <Localized id="configure-general-dsaConfig-reportingAndModerationExperience">
          <Label component="legend">
            DSA reporting and moderation experience
          </Label>
        </Localized>
        <OnOffField name="dsa.enabled" disabled={disabled} />
      </FormField>

      <FormField container={<FieldSet />}>
        <Localized id="configure-general-dsaConfig-methodOfRedress">
          <Label component="legend">Select your method of redress</Label>
        </Localized>
        <Localized id="configure-general-dsaConfig-methodOfRedress-explanation">
          <HelperText>
            Let users know if and how they can appeal a moderation decision
          </HelperText>
        </Localized>
        <DSAMethodOfRedressOptions
          name="dsa.methodOfRedress"
          disabled={disabled}
        />
      </FormField>
    </ConfigBox>
  );
};
