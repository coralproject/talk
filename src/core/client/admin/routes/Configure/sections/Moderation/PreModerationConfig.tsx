import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { parseStringBool } from "coral-framework/lib/form";
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

const parse = (v: string) => {
  return parseStringBool(v) ? "PRE" : "POST";
};

const format = (v: "PRE" | "POST") => {
  return v === "PRE";
};

const PreModerationConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <ConfigBox
      title={
        <Localized id="configure-moderation-preModeration-title">
          <Header component="legend">Pre-moderation</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      <Localized id="configure-moderation-preModeration-explanation">
        <FormFieldDescription>
          When pre-moderation is turned on, comments will not be published
          unless approved by a moderator.
        </FormFieldDescription>
      </Localized>
      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-preModeration-moderation">
          <Label component="legend">Pre-moderate all comments sitewide</Label>
        </Localized>
        <OnOffField
          name="moderation"
          disabled={disabled}
          parse={parse}
          format={format}
        />
      </FormField>
      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-preModeration-premodLinksEnable">
          <Label component="legend">
            Pre-moderate comments containing links sitewide
          </Label>
        </Localized>
        <OnOffField name="premodLinksEnable" disabled={disabled} />
      </FormField>
    </ConfigBox>
  );
};

export default PreModerationConfig;
