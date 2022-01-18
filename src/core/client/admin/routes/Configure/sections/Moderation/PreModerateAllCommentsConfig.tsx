import React, { FunctionComponent } from "react";
import { useField } from "react-final-form";
import { graphql } from "react-relay";

import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import { GQLMODERATION_MODE } from "coral-framework/schema";

import AllSpecificSitesOffField from "./AllSpecificSitesOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment PreModerateAllCommentsConfig_formValues on Settings {
    moderation
    premoderateAllCommentsSites
  }
`;

interface Props {
  disabled: boolean;
}

const specificSitesIsEnabled: Condition = (_value, values) =>
  Boolean(values.moderation === GQLMODERATION_MODE.SPECIFIC_SITES_PRE);

const PreModerateAllCommentsConfig: FunctionComponent<Props> = ({
  disabled,
}) => {
  const {
    input: premoderateAllCommentsSitesInput,
    meta: premoderateAllCommentsSitesMeta,
  } = useField<string[]>("premoderateAllCommentsSites", {
    validate: validateWhen(specificSitesIsEnabled, required),
  });

  const { input: moderationInput } = useField<string>("moderation");

  return (
    <AllSpecificSitesOffField
      disabled={disabled}
      fieldOptionName="moderation"
      moderationModeInput={moderationInput}
      specificSitesInput={premoderateAllCommentsSitesInput}
      specificSitesMeta={premoderateAllCommentsSitesMeta}
    />
  );
};

export default PreModerateAllCommentsConfig;
