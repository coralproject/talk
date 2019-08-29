import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { parseStringBool } from "coral-framework/lib/form";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputLabel,
  Typography,
} from "coral-ui/components";

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
    <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
      <Localized id="configure-moderation-preModeration-title">
        <Header container="legend">Pre-moderation</Header>
      </Localized>
      <Localized id="configure-moderation-preModeration-explanation">
        <Typography variant="bodyCopy">
          When pre-moderation is turned on, comments will not be published
          unless approved by a moderator.
        </Typography>
      </Localized>
      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-preModeration-moderation">
          <InputLabel container="legend">
            Pre-moderate all comments sitewide
          </InputLabel>
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
          <InputLabel container="legend">
            Pre-moderate comments containing links sitewide
          </InputLabel>
        </Localized>
        <OnOffField name="premodLinksEnable" disabled={disabled} />
      </FormField>
    </HorizontalGutter>
  );
};

export default PreModerationConfig;
