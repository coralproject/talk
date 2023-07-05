import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, useField } from "react-final-form";

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

import SpecificSitesSelectedQuery from "./SpecificSitesSelectedQuery";

import styles from "./AllSpecificOffSitesField.css";

interface Props {
  disabled: boolean;
  moderationModeFieldName: string;
  specificSitesFieldName: string;
  specificSitesIsEnabledCondition: Condition<any, any>;
}

const AllSpecificOffSitesField: FunctionComponent<Props> = ({
  disabled,
  moderationModeFieldName,
  specificSitesFieldName,
  specificSitesIsEnabledCondition,
}) => {
  const { input: moderationModeInput } = useField<string>(
    moderationModeFieldName
  );
  const { input: specificSitesInput, meta: specificSitesMeta } = useField<
    string[]
  >(specificSitesFieldName, {
    validate: validateWhen(specificSitesIsEnabledCondition, required),
  });
  const onAddSite = useCallback(
    (siteID: string) => {
      const changed = [...specificSitesInput.value];
      const index = changed.indexOf(siteID);
      if (index === -1) {
        changed.push(siteID);
      }
      specificSitesInput.onChange(changed);
    },
    [specificSitesInput]
  );

  const onRemoveSite = useCallback(
    (siteID: string) => {
      const changed = [...specificSitesInput.value];
      const index = changed.indexOf(siteID);
      if (index >= 0) {
        changed.splice(index, 1);
      }
      specificSitesInput.onChange(changed);
    },
    [specificSitesInput]
  );

  return (
    <>
      <Field
        name={`${moderationModeFieldName}`}
        type="radio"
        value={GQLMODERATION_MODE.PRE}
      >
        {({ input }) => (
          <RadioButton
            {...input}
            id={`${input.name}-${GQLMODERATION_MODE.PRE}`}
            disabled={disabled}
          >
            <Localized id="configure-moderation-allSites">
              <span>All sites</span>
            </Localized>
          </RadioButton>
        )}
      </Field>
      <Field
        name={`${moderationModeFieldName}`}
        type="radio"
        value={GQLMODERATION_MODE.SPECIFIC_SITES_PRE}
      >
        {({ input }) => (
          <>
            <RadioButton
              {...input}
              id={`${input.name}-${GQLMODERATION_MODE.SPECIFIC_SITES_PRE}`}
              disabled={disabled}
            >
              <Localized id="configure-moderation-specificSites">
                <span>Specific sites</span>
              </Localized>
            </RadioButton>
          </>
        )}
      </Field>
      {moderationModeInput.value === GQLMODERATION_MODE.SPECIFIC_SITES_PRE && (
        <div className={styles.specificSites}>
          <HorizontalGutter spacing={3} mt={3} mb={3}>
            {specificSitesInput.value.map((siteID: string) => {
              return (
                <SpecificSitesSelectedQuery
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
          {hasError(specificSitesMeta) ? (
            <Localized id="specificSitesSelect-validation">
              <ValidationMessage className={styles.validationMessage}>
                You must select at least one site.
              </ValidationMessage>
            </Localized>
          ) : null}
        </div>
      )}
      <Field
        name={`${moderationModeFieldName}`}
        type="radio"
        value={GQLMODERATION_MODE.POST}
      >
        {({ input }) => (
          <RadioButton
            {...input}
            id={`${input.name}-${GQLMODERATION_MODE.POST}`}
            disabled={disabled}
          >
            <Localized id="configure-onOffField-off">
              <span>Off</span>
            </Localized>
          </RadioButton>
        )}
      </Field>
    </>
  );
};

export default AllSpecificOffSitesField;
