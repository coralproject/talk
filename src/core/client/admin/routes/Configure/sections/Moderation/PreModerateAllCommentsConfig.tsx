import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, useField } from "react-final-form";
import { graphql } from "react-relay";

import SiteSearch from "coral-admin/components/SiteSearch";
import { HorizontalGutter, RadioButton } from "coral-ui/components/v2";

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

const PreModerateAllCommentsConfig: FunctionComponent<Props> = ({
  disabled,
}) => {
  const { input: premodSites } = useField<string[]>(
    "premoderateAllCommentsSites"
  );

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
            {input.checked && (
              <div className={styles.specificSites}>
                <Field name="premoderateAllCommentsSites">
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
          <RadioButton {...input} id={`${input.name}-POST`} disabled={disabled}>
            {/* KNOTE: Okay to use this localized here? */}
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
