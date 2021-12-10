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

import PreModerationSitesSelectedQuery from "./PreModerationSitesSelectedQuery";

import styles from "./PreModerateAllCommentsConfig.css";

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

  const onAddSite = useCallback(
    (siteID: string) => {
      const changed = [...premoderateAllCommentsSitesInput.value];
      const index = changed.indexOf(siteID);
      if (index === -1) {
        changed.push(siteID);
      }
      premoderateAllCommentsSitesInput.onChange(changed);
    },
    [premoderateAllCommentsSitesInput]
  );

  const onRemoveSite = useCallback(
    (siteID: string) => {
      const changed = [...premoderateAllCommentsSitesInput.value];
      const index = changed.indexOf(siteID);
      if (index >= 0) {
        changed.splice(index, 1);
      }
      premoderateAllCommentsSitesInput.onChange(changed);
    },
    [premoderateAllCommentsSitesInput]
  );

  return (
    <>
      <Field name="moderation" type="radio" value="PRE">
        {({ input }) => (
          <RadioButton {...input} id={`${input.name}-PRE`} disabled={disabled}>
            <Localized id="configure-moderation-allSites">
              <span>All sites</span>
            </Localized>
          </RadioButton>
        )}
      </Field>
      <Field name="moderation" type="radio" value="SPECIFIC_SITES_PRE">
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
      {moderationInput.value === GQLMODERATION_MODE.SPECIFIC_SITES_PRE && (
        <div className={styles.specificSites}>
          <HorizontalGutter spacing={3} mt={3} mb={3}>
            {premoderateAllCommentsSitesInput.value.map((siteID: string) => {
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
          {hasError(premoderateAllCommentsSitesMeta) ? (
            <Localized id="specificSitesSelect-validation">
              <ValidationMessage className={styles.validationMessage}>
                You must select at least one site.
              </ValidationMessage>
            </Localized>
          ) : null}
        </div>
      )}
      <Field name="moderation" type="radio" value="POST">
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

export default PreModerateAllCommentsConfig;
