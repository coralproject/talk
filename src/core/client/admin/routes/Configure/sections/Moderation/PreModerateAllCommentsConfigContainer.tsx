import { Localized } from "@fluent/react/compat";
import React from "react";
import { graphql } from "react-relay";

import { formatBool, parseStringBool } from "coral-framework/lib/form";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { FieldSet, FormField, Label } from "coral-ui/components/v2";

import { PreModerateAllCommentsConfigContainer_settings } from "coral-admin/__generated__/PreModerateAllCommentsConfigContainer_settings.graphql";

import OnOffField from "../../OnOffField";
import PreModerateAllCommentsConfig from "./PreModerateAllCommentsConfig";

interface Props {
  settings: PreModerateAllCommentsConfigContainer_settings;
  disabled: boolean;
}

const parse = (v: string) => {
  return parseStringBool(v) ? "PRE" : "POST";
};

const format = (v: "PRE" | "POST") => {
  return formatBool(v === "PRE");
};

const PreModerateAllCommentsConfigContainer: React.FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  return (
    <FormField container={<FieldSet />}>
      <Localized id="configure-moderation-preModeration-moderation">
        <Label component="legend">Pre-moderate all comments sitewide</Label>
      </Localized>
      {settings.multisite ? (
        <PreModerateAllCommentsConfig disabled={disabled} />
      ) : (
        <OnOffField
          name="moderation"
          disabled={disabled}
          parse={parse}
          format={format}
        />
      )}
    </FormField>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment PreModerateAllCommentsConfigContainer_settings on Settings {
      multisite
    }
  `,
})(PreModerateAllCommentsConfigContainer);

export default enhanced;
