import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { formatBool, parseStringBool } from "coral-framework/lib/form";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";
import { Link } from "coral-ui/components/v3";

import { PreModerationConfigContainer_settings$data as PreModerationConfigContainer_settings } from "coral-admin/__generated__/PreModerationConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import PreModerateAllCommentsConfig from "./PreModerateAllCommentsConfig";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment PreModerationConfigContainer_formValues on Settings {
    moderation
    premodLinksEnable
    premoderateSuspectWords
    premoderateAllCommentsSites
  }
`;

interface Props {
  disabled: boolean;
  settings: PreModerationConfigContainer_settings;
}

const parse = (v: string) => {
  return parseStringBool(v) ? "PRE" : "POST";
};

const format = (v: "PRE" | "POST") => {
  return formatBool(v === "PRE");
};

const PreModerationConfigContainer: FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  return (
    <ConfigBox
      id="Comments"
      title={
        <Localized id="configure-moderation-preModeration-title">
          <Header container={<legend />}>Pre-moderation</Header>
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
          <Label component="legend">Pre-moderate all comments</Label>
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
      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-preModeration-premodLinksEnable">
          <Label component="legend">
            Pre-moderate all comments containing links
          </Label>
        </Localized>
        <OnOffField name="premodLinksEnable" disabled={disabled} />
      </FormField>
      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-premModeration-premodSuspectWordsEnable">
          <Label component="legend">
            Pre-moderate all comments containing Suspect Words
          </Label>
        </Localized>
        <Localized
          id="configure-moderation-premModeration-premodSuspectWordsDescription"
          wordListLink={<Link href="/admin/configure/wordList" />}
        >
          <FormFieldDescription>
            You can view and edit your Suspect Word list{" "}
            <Link href="/admin/configure/wordList">here</Link>
          </FormFieldDescription>
        </Localized>
        <OnOffField name="premoderateSuspectWords" disabled={disabled} />
      </FormField>
    </ConfigBox>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment PreModerationConfigContainer_settings on Settings {
      multisite
    }
  `,
})(PreModerationConfigContainer);

export default enhanced;
