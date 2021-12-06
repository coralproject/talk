import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useField } from "react-final-form";

import SiteSearch from "coral-admin/components/SiteSearch";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import { hasError } from "coral-framework/lib/form";
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

  const singleSitesIsEnabled: Condition = (_value, values) => {
    return values.showSingleSites;
  };

  const { input: selectedIDsInput, meta: selectedIDsInputMeta } = useField<
    string[]
  >("selectedIDs", {
    validate: validateWhen(singleSitesIsEnabled, required),
  });
  const { input: showSingleSitesInput } = useField<boolean>("showSingleSites", {
    initialValue: !!(viewerIsScoped || viewerIsSingleSiteMod),
  });

  useEffect(() => {
    if (viewerIsSiteMod) {
      const sites = viewerScopes.sites?.map((site) => site.id);
      selectedIDsInput.onChange(sites);
    }
  }, []);

  const [candidateSites, setCandidateSites] = useState<string[]>(
    viewerIsSiteMod
      ? viewerScopes.sites
        ? viewerScopes.sites.map((site) => site.id)
        : []
      : selectedIDsInput.value
  );

  const onHideSingleSites = useCallback(() => {
    showSingleSitesInput.onChange(false);
  }, [showSingleSitesInput]);
  const onShowSingleSites = useCallback(() => {
    showSingleSitesInput.onChange(true);
  }, [showSingleSitesInput]);

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
                    checked={!showSingleSitesInput.value}
                    onChange={onHideSingleSites}
                  >
                    All sites
                  </RadioButton>
                </Localized>
              </FormField>
              <FormField>
                <Localized id="community-banModal-specificSites">
                  <RadioButton
                    checked={showSingleSitesInput.value}
                    onChange={onShowSingleSites}
                  >
                    Specific Sites
                  </RadioButton>
                </Localized>
              </FormField>
            </Flex>
          )}

          {showSingleSitesInput.value && (
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
                />
              )}
              {hasError(selectedIDsInputMeta) ? (
                <Localized id="singleSitesSelect-validation">
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
