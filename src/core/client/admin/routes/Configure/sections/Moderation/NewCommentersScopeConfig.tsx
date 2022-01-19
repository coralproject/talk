import React, { FunctionComponent } from "react";
import { useField } from "react-final-form";

import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import { GQLMODERATION_MODE } from "coral-framework/schema";

import AllSpecificOffSitesField from "./AllSpecificOffSitesField";

interface Props {
  disabled: boolean;
}

const specificSitesIsEnabled: Condition = (_value, values) => {
  return Boolean(
    values.newCommenters.moderation &&
      values.newCommenters.moderation.mode ===
        GQLMODERATION_MODE.SPECIFIC_SITES_PRE
  );
};

const NewCommentersScopeConfig: FunctionComponent<Props> = ({ disabled }) => {
  const { input: newCommentersModerationModeInput } = useField<string>(
    "newCommenters.moderation.mode"
  );
  const {
    input: newCommentersPremodSitesInput,
    meta: newCommentersPremodSitesMeta,
  } = useField<string[]>("newCommenters.moderation.premodSites", {
    validate: validateWhen(specificSitesIsEnabled, required),
  });

  return (
    <AllSpecificOffSitesField
      disabled={disabled}
      fieldOptionName="newCommenters.moderation.mode"
      moderationModeInput={newCommentersModerationModeInput}
      specificSitesInput={newCommentersPremodSitesInput}
      specificSitesMeta={newCommentersPremodSitesMeta}
    />
  );
};

export default NewCommentersScopeConfig;
