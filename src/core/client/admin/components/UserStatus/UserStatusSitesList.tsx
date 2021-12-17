import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useField } from "react-final-form";

import SiteSearch from "coral-admin/components/SiteSearch";
import { hasError } from "coral-framework/lib/form";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  FieldSet,
  Flex,
  FormField,
  HorizontalGutter,
  Label,
  RadioButton,
  ValidationMessage,
} from "coral-ui/components/v2";

import { USER_ROLE } from "coral-admin/__generated__/UserStatusChangeContainer_viewer.graphql";

import UserStatusSitesListSelectedSiteQuery from "./UserStatusSitesListSelectedSiteQuery";

import styles from "./UserStatusSitesList.css";

interface ScopeSite {
  readonly id: string;
  readonly name: string;
}

export interface Scopes {
  role: USER_ROLE;
  sites?: ScopeSite[] | null;
}

interface Props {
  viewerScopes: Scopes;
}

const UserStatusSitesList: FunctionComponent<Props> = ({ viewerScopes }) => {
  const viewerIsAdmin = viewerScopes.role === GQLUSER_ROLE.ADMIN;
  const viewerIsOrgAdmin =
    viewerScopes.role === GQLUSER_ROLE.MODERATOR &&
    !!(!viewerScopes.sites || viewerScopes.sites?.length === 0);
  const viewerIsScoped = !!viewerScopes.sites && viewerScopes.sites.length > 0;
  const viewerIsSiteMod =
    viewerScopes.role === GQLUSER_ROLE.MODERATOR && viewerIsScoped;
  const viewerIsSingleSiteMod = !!(
    viewerIsSiteMod &&
    viewerScopes.sites &&
    viewerScopes.sites.length === 1
  );

  const specificSitesIsEnabled: Condition = (_value, values) => {
    return values.showSpecificSites;
  };

  const { input: selectedIDsInput, meta: selectedIDsMeta } = useField<string[]>(
    "selectedIDs",
    {
      validate: validateWhen(specificSitesIsEnabled, required),
    }
  );
  const { input: showSpecificSitesInput } = useField<boolean>(
    "showSpecificSites",
    {
      initialValue: !!(viewerIsScoped || viewerIsSingleSiteMod),
    }
  );

  useEffect(() => {
    // Site mods should have all sites within scope selected by default
    if (viewerIsSiteMod) {
      selectedIDsInput.onChange(viewerScopes.sites?.map((site) => site.id));
    }
  }, []);

  const [candidateSites, setCandidateSites] = useState<string[]>(
    viewerIsSiteMod && viewerScopes.sites
      ? viewerScopes.sites.map((site) => site.id)
      : []
  );

  const onHideSpecificSites = useCallback(() => {
    showSpecificSitesInput.onChange(false);
  }, [showSpecificSitesInput]);
  const onShowSpecificSites = useCallback(() => {
    showSpecificSitesInput.onChange(true);
  }, [showSpecificSitesInput]);

  const onRemoveSite = useCallback(
    (siteID: string) => {
      const changed = [...selectedIDsInput.value];

      const index = changed.indexOf(siteID);
      if (index >= 0) {
        changed.splice(index, 1);
      }

      selectedIDsInput.onChange(changed);
    },
    [selectedIDsInput]
  );

  const onAddSite = useCallback(
    (siteID: string) => {
      const changed = [...selectedIDsInput.value];

      const index = changed.indexOf(siteID);
      if (index === -1) {
        changed.push(siteID);
        if (!candidateSites.includes(siteID)) {
          setCandidateSites([...candidateSites, siteID]);
        }
      }

      selectedIDsInput.onChange(changed);
    },
    [selectedIDsInput]
  );

  const onToggleSite = useCallback(
    (siteID: string, checked: boolean) =>
      checked ? onRemoveSite(siteID) : onAddSite(siteID),
    [onAddSite, onRemoveSite]
  );

  return (
    <>
      <IntersectionProvider>
        <FieldSet>
          <div className={styles.header}>
            <Localized id="community-banModal-banFrom">
              <Label>Ban from</Label>
            </Localized>
          </div>

          {(viewerIsAdmin ||
            viewerIsOrgAdmin ||
            (viewerIsScoped && !viewerIsSingleSiteMod)) && (
            <Flex className={styles.sitesToggle} spacing={5}>
              <FormField>
                <Localized id="community-banModal-allSites">
                  <RadioButton
                    checked={!showSpecificSitesInput.value}
                    onChange={onHideSpecificSites}
                  >
                    All sites
                  </RadioButton>
                </Localized>
              </FormField>
              <FormField>
                <Localized id="community-banModal-specificSites">
                  <RadioButton
                    checked={showSpecificSitesInput.value}
                    onChange={onShowSpecificSites}
                  >
                    Specific Sites
                  </RadioButton>
                </Localized>
              </FormField>
            </Flex>
          )}

          {showSpecificSitesInput.value && (
            <>
              <HorizontalGutter spacing={3} mt={5} mb={4}>
                {candidateSites.map((siteID) => {
                  const checked = selectedIDsInput.value.includes(siteID);
                  return (
                    <UserStatusSitesListSelectedSiteQuery
                      key={siteID}
                      siteID={siteID}
                      onChange={onToggleSite}
                      checked={checked}
                    />
                  );
                })}
              </HorizontalGutter>
              {!viewerIsSiteMod && (
                <SiteSearch
                  onSelect={onAddSite}
                  showSiteSearchLabel={false}
                  showOnlyScopedSitesInSearchResults={true}
                  showAllSitesSearchFilterOption={false}
                  clearTextFieldValueAfterSelect={true}
                />
              )}
              {hasError(selectedIDsMeta) ? (
                <Localized id="specificSitesSelect-validation">
                  <ValidationMessage className={styles.validationMessage}>
                    You must select at least one site.
                  </ValidationMessage>
                </Localized>
              ) : null}
            </>
          )}
        </FieldSet>
      </IntersectionProvider>
    </>
  );
};

export default UserStatusSitesList;
