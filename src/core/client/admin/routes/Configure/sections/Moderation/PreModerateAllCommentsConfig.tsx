// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { HorizontalGutter, RadioButton } from "coral-ui/components/v2";

import { Field, useField } from "react-final-form";
import SiteSearch from "coral-admin/components/SiteSearch";
import PreModerationSitesSelectedQuery from "./PreModerationSitesSelectedQuery";

import styles from "./PreModerateAllCommentsConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment PreModerateAllCommentsConfig_formValues on Settings {
    moderation
    premoderationSites
  }
`;

interface Props {
  disabled: boolean;
}

const PreModerateAllCommentsConfig: FunctionComponent<Props> = ({
  disabled,
}) => {
  const { input: premodSites } = useField<string[]>("premoderationSites");

  const onSiteSearchSelect = useCallback(
    (siteID: string) => {
      const changed = [...premodSites.value];
      const index = changed.indexOf(siteID);
      if (index === -1) {
        changed.push(siteID);
      }
      premodSites.onChange(changed);
    },
    [premodSites]
  );

  const onRemoveSite = useCallback(
    (siteID: string) => {
      const changed = [...premodSites.value];
      const index = changed.indexOf(siteID);
      if (index >= 0) {
        changed.splice(index, 1);
      }
      premodSites.onChange(changed);
    },
    [premodSites]
  );
  return (
    <>
      <Field name="moderation" type="radio" value="PRE">
        {({ input }) => (
          <RadioButton
            {...input}
            // KNOTE: confirm id
            id="moderation-PRE"
            disabled={disabled}
          >
            {/* KNOTE: Add localized */}
            All sites
          </RadioButton>
        )}
      </Field>
      <Field name="moderation" type="radio" value="SINGLE_SITES">
        {({ input }) => (
          <>
            <RadioButton
              {...input}
              // KNOTE: confirm id
              id="moderation-SINGLE_SITES"
              disabled={disabled}
            >
              {/* KNOTE: Add localized */}
              Single sites
            </RadioButton>
            {input.checked && (
              <div className={styles.specificSites}>
                <Field name="premoderationSites">
                  {() => (
                    <>
                      <HorizontalGutter spacing={3} mt={3} mb={3}>
                        {premodSites.value.map((siteID: string) => {
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
                        onSelect={onSiteSearchSelect}
                      />
                    </>
                  )}
                </Field>
              </div>
            )}
          </>
        )}
      </Field>
      <Field name="moderation" type="radio" value="POST">
        {({ input }) => (
          <RadioButton
            {...input}
            // KNOTE: confirm id
            id="moderation-POST"
            disabled={disabled}
          >
            {/* KNOTE: Add localized */}
            Off
          </RadioButton>
        )}
      </Field>
    </>
  );
};

export default PreModerateAllCommentsConfig;
