import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";
import { Link } from "coral-ui/components/v3";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import PreModerateAllCommentsConfigContainer from "./PreModerateAllCommentsConfigContainer";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment PreModerationConfig_formValues on Settings {
    moderation
    premodLinksEnable
    premoderateSuspectWords
    premoderateAllCommentsSites
  }
`;

interface Props {
  disabled: boolean;
  // KNOTE: update type
  settings: any;
}

const PreModerationConfig: FunctionComponent<Props> = ({
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
      <PreModerateAllCommentsConfigContainer
        disabled={disabled}
        settings={settings}
      />
      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-preModeration-premodLinksEnable">
          <Label component="legend">
            Pre-moderate comments containing links sitewide
          </Label>
        </Localized>
        <OnOffField name="premodLinksEnable" disabled={disabled} />
      </FormField>
      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-premModeration-premodSuspectWordsEnable">
          <Label component="legend">
            Pre-moderate comments containing Suspect Words
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

export default PreModerationConfig;
