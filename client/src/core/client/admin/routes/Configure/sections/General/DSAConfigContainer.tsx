import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { withFragmentContainer } from "coral-framework/lib/relay";
import HTMLContent from "coral-stream/common/HTMLContent";
import {
  FieldSet,
  FormField,
  FormFieldDescription,
  HelperText,
  Label,
} from "coral-ui/components/v2";

import { DSAConfigContainer_settings } from "coral-admin/__generated__/DSAConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import DSAMethodOfRedressOptions from "./DSAMethodOfRedressOptions";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment DSAConfigContainer_formValues on Settings {
    dsa {
      enabled
      methodOfRedress {
        method
        url
        email
      }
    }
  }
`;

interface Props {
  disabled: boolean;
  settings: DSAConfigContainer_settings;
}

export const DSAConfigContainer: FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  const { localeBundles } = useCoralContext();

  const descriptionText = getMessage(
    localeBundles,
    "configure-general-dsaConfig-description",
    `The EU Digital Services Act (DSA) requires that publishers based in the EU or targeting EU citizens provide certain features to their commenters and moderators.
    <br/>
    <br/>
    Coral's DSA toolset includes:
    <br/>
    <ul style="padding-inline-start: var(--spacing-5);">
      <li>A dedicated flow for comments reported as illegal</li>
      <li>Compulsory moderation reasons for every rejected comment</li>
      <li>Commenter notifications for illegal comment reporting and rejected comments</li>
      <li>Compulsory text explaining methods of redress/appeal, if any</li>
    </ul>`
  );

  return (
    <ConfigBox
      data-testid="configure-general-dsaConfig"
      title={
        <Localized id="configure-general-dsaConfig-title">
          <Header container="h2">Digital Services Act feature set</Header>
        </Localized>
      }
    >
      <FormFieldDescription>
        <HTMLContent>{descriptionText}</HTMLContent>
      </FormFieldDescription>
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
          disabled={disabled}
          defaultMethod={settings?.dsa?.methodOfRedress?.method ?? null}
        />
      </FormField>
    </ConfigBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment DSAConfigContainer_settings on Settings {
      dsa {
        enabled
        methodOfRedress {
          method
          url
          email
        }
      }
    }
  `,
})(DSAConfigContainer);

export default enhanced;
