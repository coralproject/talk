import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { useField } from "react-final-form";

import SiteSearch from "coral-admin/components/SiteSearch";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import { FieldSet, HorizontalGutter, Label } from "coral-ui/components/v2";

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
  readonly banActive?: Readonly<boolean>;
  readonly bannedSites: ReadonlyArray<ScopeSite>;
  viewerScopes: Scopes;
}

const UserStatusSitesList: FunctionComponent<Props> = ({
  viewerScopes,
  bannedSites,
  banActive,
}) => {
  const viewerIsScoped = !!viewerScopes.sites && viewerScopes.sites.length > 0;

  const initiallyBanned = useCallback(
    (siteID: string) => bannedSites.some(({ id }) => id === siteID),
    [bannedSites]
  );

  const [candidateSites, setCandidateSites] = useState<string[]>(
    bannedSites.map((bs) => bs.id)
  );

  const { input: banSiteIDs } = useField<string[]>("banSiteIDs");
  const { input: unbanSiteIDs } = useField<string[]>("unbanSiteIDs");

  const onUnbanFromSite = useCallback(
    (siteID: string) => {
      const inBanIDs = banSiteIDs.value.indexOf(siteID) > -1;
      const inUnbanIDs = unbanSiteIDs.value.indexOf(siteID) > -1;
      if (inBanIDs) {
        // remove from banSiteIDs
        banSiteIDs.onChange(banSiteIDs.value.filter((id) => id !== siteID));
      }
      if (!inUnbanIDs) {
        // add to unbanSiteIDs
        unbanSiteIDs.onChange([...unbanSiteIDs.value, siteID]);
      }
    },
    [banSiteIDs, unbanSiteIDs]
  );

  const onBanFromSite = useCallback(
    (siteID: string) => {
      const inBanIDs = banSiteIDs.value.indexOf(siteID) > -1;
      const inUnbanIDs = unbanSiteIDs.value.indexOf(siteID) > -1;
      if (!inBanIDs) {
        // add to banSiteIDs
        banSiteIDs.onChange([...banSiteIDs.value, siteID]);
      }
      if (inUnbanIDs) {
        // remove from unbanSiteIDs
        unbanSiteIDs.onChange(unbanSiteIDs.value.filter((id) => id !== siteID));
      }
    },
    [banSiteIDs, unbanSiteIDs]
  );

  const onToggleSite = useCallback(
    (siteID: string, ban: boolean) =>
      ban ? onBanFromSite(siteID) : onUnbanFromSite(siteID),
    [onBanFromSite, onUnbanFromSite]
  );

  const onAddSite = useCallback(
    (id: string | null) => {
      if (!id) {
        return;
      }

      if (candidateSites.includes(id)) {
        return;
      }

      setCandidateSites([...candidateSites, id]);
      onToggleSite(id, true);
    },
    [onToggleSite]
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

          <HorizontalGutter spacing={3} mt={5} mb={4}>
            {candidateSites.map((siteID) => {
              const checked =
                banSiteIDs.value.includes(siteID) ||
                (initiallyBanned(siteID) &&
                  !unbanSiteIDs.value.includes(siteID));

              return (
                <UserStatusSitesListSelectedSiteQuery
                  key={siteID}
                  siteID={siteID}
                  checked={checked}
                  onChange={onToggleSite}
                  disabled={viewerIsScoped && initiallyBanned(siteID)}
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
        </FieldSet>
      </IntersectionProvider>
    </>
  );
};

export default UserStatusSitesList;
