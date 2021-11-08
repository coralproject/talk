import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { useField } from "react-final-form";

import SiteSearch from "coral-admin/components/SiteSearch";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  FieldSet,
  Flex,
  FormField,
  Label,
  RadioButton,
} from "coral-ui/components/v2";

import { USER_ROLE } from "coral-admin/__generated__/UserStatusChangeContainer_viewer.graphql";

import UserStatusSitesListSelectedSitesQuery from "./UserStatusSitesListSelectedSitesQuery";

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

  const [showSites, setShowSites] = useState<boolean>(
    !!(viewerIsScoped || viewerIsSingleSiteMod)
  );

  const { input: selectedIDsInput } = useField<string[]>("selectedIDs");

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
            <>
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
              {showSites && (
                <>
                  <UserStatusSitesListSelectedSitesQuery
                    selectedSites={selectedIDsInput.value}
                    onRemoveSite={onRemoveSite}
                  />
                  <SiteSearch
                    onSelect={onAddSite}
                    showSiteSearchLabel={false}
                    showOnlyScopedSitesInSiteSearchList={true}
                    showAllSitesSearchFilterOption={false}
                  />
                </>
              )}
            </>
          )}
        </FieldSet>
      </IntersectionProvider>
    </>
  );
};

export default UserStatusSitesList;
