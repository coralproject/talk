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
import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  FieldSet,
  Flex,
  FormField,
  HorizontalGutter,
  Label,
  RadioButton,
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
  readonly bannedSites: ReadonlyArray<ScopeSite>; // MARCUS better way to do this?
  viewerScopes: Scopes;
}

const UserStatusSitesList: FunctionComponent<Props> = ({
  viewerScopes,
  bannedSites,
}) => {
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

  const [showSites, setShowSites] = useState<boolean>(
    !!(viewerIsScoped || viewerIsSingleSiteMod)
  );

  const { input: selectedIDsInput } = useField<string[]>("selectedIDs");
  // MARCUS: set initial banned sites

  useEffect(() => {
    selectedIDsInput.onChange(bannedSites.map((bs) => bs.id)); // This is probably just handled by the selected site qeury
  }, [bannedSites]);
  // MARCUS: including selectedIDsInput in dep array causes selectedIDs to be overwritten?

  /* eslint-disable */
  console.log({ sites: selectedIDsInput.value }, "UserStatusSitesList rendering");

  const onHideSites = useCallback(() => {
    setShowSites(false);
  }, [setShowSites]);
  const onShowSites = useCallback(() => {
    setShowSites(true);
  }, [setShowSites]);
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
      /* eslint-disable */
      console.log({ siteID }, "onAddSite!");
      const changed = [...selectedIDsInput.value];

      const index = changed.indexOf(siteID);
      if (index === -1) {
        changed.push(siteID);
      }

      selectedIDsInput.onChange(changed);
    },
    [selectedIDsInput]
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
                  <RadioButton checked={!showSites} onChange={onHideSites}>
                    All sites
                  </RadioButton>
                </Localized>
              </FormField>
              <FormField>
                <Localized id="community-banModal-specificSites">
                  <RadioButton checked={showSites} onChange={onShowSites}>
                    Specific Sites
                  </RadioButton>
                </Localized>
              </FormField>
            </Flex>
          )}

          {showSites && (
            <>
              <HorizontalGutter spacing={3} mt={5} mb={4}>
                {selectedIDsInput.value.map((siteID) => {
                  return (
                    <UserStatusSitesListSelectedSiteQuery
                      key={siteID}
                      siteID={siteID}
                      onChange={onRemoveSite}
                    />
                  );
                })}
              </HorizontalGutter>
              <SiteSearch
                onSelect={onAddSite}
                showSiteSearchLabel={false}
                showOnlyScopedSitesInSearchResults={true}
                showAllSitesSearchFilterOption={false}
              />
            </>
          )}
        </FieldSet>
      </IntersectionProvider>
    </>
  );
};

export default UserStatusSitesList;
