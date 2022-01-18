import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, FieldInputProps, FieldMetaState } from "react-final-form";

import SiteSearch from "coral-admin/components/SiteSearch";
import { hasError } from "coral-framework/lib/form";
import { GQLMODERATION_MODE } from "coral-framework/schema";
import {
  HorizontalGutter,
  RadioButton,
  ValidationMessage,
} from "coral-ui/components/v2";

import SpecificSitesSelectedQuery from "./SpecificSitesSelectedQuery";
import styles from "./AllSpecificSitesOffField.css";

interface Props {
  disabled: boolean;
  fieldOptionName: string;
  moderationModeInput: FieldInputProps<string, HTMLElement>;
  specificSitesInput: FieldInputProps<string[], HTMLElement>;
  specificSitesMeta: FieldMetaState<string[]>;
}

const AllSpecificSitesOffField: FunctionComponent<Props> = ({
  disabled,
  fieldOptionName,
  moderationModeInput,
  specificSitesInput,
  specificSitesMeta,
}) => {
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
      <Field name={`${fieldOptionName}`} type="radio" value="PRE">
        {({ input }) => (
          <RadioButton {...input} id={`${input.name}-PRE`} disabled={disabled}>
            <Localized id="configure-moderation-allSites">
              <span>All sites</span>
            </Localized>
          </RadioButton>
        )}
      </Field>
      <Field
        name={`${fieldOptionName}`}
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
      <Field name={`${fieldOptionName}`} type="radio" value="POST">
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

export default AllSpecificSitesOffField;
