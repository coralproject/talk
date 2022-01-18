import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, useField } from "react-final-form";
import { graphql } from "react-relay";

import SiteSearch from "coral-admin/components/SiteSearch";
import { hasError } from "coral-framework/lib/form";
import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import { GQLMODERATION_MODE } from "coral-framework/schema";
import {
  HorizontalGutter,
  RadioButton,
  ValidationMessage,
} from "coral-ui/components/v2";

// KNOTE: Rename for reuse
import PreModerationSitesSelectedQuery from "./PreModerationSitesSelectedQuery";

// KNOTE: use own styles
import styles from "./PreModerateAllCommentsConfig.css";

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

  const onAddSite = useCallback(
    (siteID: string) => {
      const changed = [...newCommentersPremodSitesInput.value];
      const index = changed.indexOf(siteID);
      if (index === -1) {
        changed.push(siteID);
      }
      newCommentersPremodSitesInput.onChange(changed);
    },
    [newCommentersPremodSitesInput]
  );

  const onRemoveSite = useCallback(
    (siteID: string) => {
      const changed = [...newCommentersPremodSitesInput.value];
      const index = changed.indexOf(siteID);
      if (index >= 0) {
        changed.splice(index, 1);
      }
      newCommentersPremodSitesInput.onChange(changed);
    },
    [newCommentersPremodSitesInput]
  );

  return (
    // KNOTE: Can maybe reuse between this and pre-moderation configuration?
    <>
      <Field name="newCommenters.moderation.mode" type="radio" value="PRE">
        {({ input }) => (
          <RadioButton {...input} id={`${input.name}-PRE`} disabled={disabled}>
            <Localized id="configure-moderation-allSites">
              <span>All sites</span>
            </Localized>
          </RadioButton>
        )}
      </Field>
      <Field
        name="newCommenters.moderation.mode"
        type="radio"
        value="SPECIFIC_SITES_PRE"
      >
        {({ input }) => (
          <>
            <RadioButton
              {...input}
              id={`${input.name}-SPECIFIC_SITES_PRE`}
              disabled={disabled}
            >
              <Localized id="configure-moderation-specificSites">
                <span>Specific sites</span>
              </Localized>
            </RadioButton>
          </>
        )}
      </Field>
      {newCommentersModerationModeInput.value ===
        GQLMODERATION_MODE.SPECIFIC_SITES_PRE && (
        <div className={styles.specificSites}>
          <HorizontalGutter spacing={3} mt={3} mb={3}>
            {newCommentersPremodSitesInput.value.map((siteID: string) => {
              return (
                <PreModerationSitesSelectedQuery
                  key={siteID}
                  siteID={siteID}
                  onChange={onRemoveSite}
                />
              );
            })}
          </HorizontalGutter>
          <SiteSearch
            showOnlyScopedSitesInSearchResults
            showAllSitesSearchFilterOption={false}
            showSiteSearchLabel={false}
            onSelect={onAddSite}
            clearTextFieldValueAfterSelect={true}
          />
          {hasError(newCommentersPremodSitesMeta) ? (
            <Localized id="specificSitesSelect-validation">
              <ValidationMessage className={styles.validationMessage}>
                You must select at least one site.
              </ValidationMessage>
            </Localized>
          ) : null}
        </div>
      )}
      <Field name="newCommenters.moderation.mode" type="radio" value="POST">
        {({ input }) => (
          <RadioButton {...input} id={`${input.name}-POST`} disabled={disabled}>
            <Localized id="configure-onOffField-off">
              <span>Off</span>
            </Localized>
          </RadioButton>
        )}
      </Field>
    </>
  );
};

export default NewCommentersScopeConfig;
