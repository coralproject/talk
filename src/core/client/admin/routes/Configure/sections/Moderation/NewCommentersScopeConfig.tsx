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
  fragment NewCommentersScopeConfig_formValues on Settings {
    newCommenters {
      moderation {
        mode
        premodSites
      }
    }
  }
`;

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
    <AllSpecificSitesOffField
      disabled={disabled}
      fieldOptionName="newCommenters.moderation.mode"
      moderationModeInput={newCommentersModerationModeInput}
      specificSitesInput={newCommentersPremodSitesInput}
      specificSitesMeta={newCommentersPremodSitesMeta}
    />
  );
};

export default NewCommentersScopeConfig;
