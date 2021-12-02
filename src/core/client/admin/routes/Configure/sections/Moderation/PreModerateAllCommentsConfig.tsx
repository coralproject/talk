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

const singleSitesIsEnabled: Condition = (_value, values) =>
  Boolean(values.moderation === GQLMODERATION_MODE.SINGLE_SITES);

const PreModerateAllCommentsConfig: FunctionComponent<Props> = ({
  disabled,
}) => {
  const {
    input: premoderateAllCommentsSitesInput,
    meta: premoderateAllCommentsSitesMeta,
  } = useField<string[]>("premoderateAllCommentsSites", {
    validate: validateWhen(singleSitesIsEnabled, required),
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
      <Field name="moderation" type="radio" value="SINGLE_SITES">
        {({ input }) => (
          <>
            <RadioButton
              {...input}
              id={`${input.name}-SINGLE_SITES`}
              disabled={disabled}
            >
              <Localized id="configure-moderation-singleSites">
                <span>Single sites</span>
              </Localized>
            </RadioButton>
          </>
        )}
      </Field>
      {moderationInput.value === GQLMODERATION_MODE.SINGLE_SITES && (
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
          />
          {hasError(premoderateAllCommentsSitesMeta) ? (
            <Localized id="configure-moderation-singleSites-validation">
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
