import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

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
  visible: boolean;
  readonly banActive?: Readonly<boolean>;
  readonly bannedSites: ReadonlyArray<ScopeSite>;
  banState: [string[], (siteIDs: string[]) => void];
  unbanState: [string[], (siteIDs: string[]) => void];
  viewerScopes: Scopes;
}

const UserStatusSitesList: FunctionComponent<Props> = ({
  viewerScopes,
  bannedSites,
  banState: [banSiteIDs, setBanSiteIDs],
  unbanState: [unbanSiteIDs, setUnbanSiteIDs],
  visible,
}) => {
  const viewerIsScoped = !!viewerScopes.sites && viewerScopes.sites.length > 0;

  const initiallyBanned = useCallback(
    (siteID: string) => bannedSites.some(({ id }) => id === siteID),
    [bannedSites]
  );

  const [candidateSites, setCandidateSites] = useState<string[]>(
    bannedSites.map((bs) => bs.id)
  );

  const onUnbanFromSite = useCallback(
    (siteID: string) => {
      const inBanIDs = banSiteIDs.indexOf(siteID) > -1;
      const inUnbanIDs = unbanSiteIDs.indexOf(siteID) > -1;
      if (inBanIDs) {
        // remove from banSiteIDs
        setBanSiteIDs(banSiteIDs.filter((id) => id !== siteID));
      }
      if (!inUnbanIDs) {
        // add to unbanSiteIDs
        setUnbanSiteIDs([...unbanSiteIDs, siteID]);
      }
    },
    [banSiteIDs, unbanSiteIDs]
  );

  const onBanFromSite = useCallback(
    (siteID: string) => {
      const inBanIDs = banSiteIDs.indexOf(siteID) > -1;
      const inUnbanIDs = unbanSiteIDs.indexOf(siteID) > -1;
      if (!inBanIDs) {
        // add to banSiteIDs
        setBanSiteIDs([...banSiteIDs, siteID]);
      }
      if (inUnbanIDs) {
        // remove from unbanSiteIDs
        setUnbanSiteIDs(unbanSiteIDs.filter((id) => id !== siteID));
      }
    },
    [banSiteIDs, unbanSiteIDs, setBanSiteIDs, setUnbanSiteIDs]
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

  return !visible ? (
    <></>
  ) : (
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
                banSiteIDs.includes(siteID) ||
                (initiallyBanned(siteID) && !unbanSiteIDs.includes(siteID));

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
