import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";

import SiteSearch from "coral-admin/components/SiteSearch";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import { FieldSet, HorizontalGutter, Label } from "coral-ui/components/v2";

import { UserStatusChangeContainer_viewer } from "coral-admin/__generated__/UserStatusChangeContainer_viewer.graphql";

import { dedupe } from "./helpers";
import UserStatusSitesListSelectedSiteQuery from "./UserStatusSitesListSelectedSiteQuery";

import styles from "./UserStatusSitesList.css";

interface ScopeSite {
  readonly id: string;
  readonly name: string;
}

export interface UserBanStatus {
  sites: ReadonlyArray<ScopeSite> | null;
  active: boolean | null;
}

interface Props {
  readonly userBanStatus?: UserBanStatus;
  banState: [string[], (siteIDs: string[]) => void];
  unbanState: [string[], (siteIDs: string[]) => void];
  viewer: UserStatusChangeContainer_viewer;
}

const UserStatusSitesList: FunctionComponent<Props> = ({
  viewer,
  userBanStatus,
  banState: [banSiteIDs, setBanSiteIDs],
  unbanState: [unbanSiteIDs, setUnbanSiteIDs],
}) => {
  const viewerIsScoped =
    !!viewer.moderationScopes?.sites &&
    viewer.moderationScopes.sites.length > 0;
  const viewerScopesSiteIDs = useMemo(() => {
    return viewer.moderationScopes?.sites?.map((site) => site.id);
  }, [viewer.moderationScopes]);

  const initiallyBanned = useCallback(
    (siteID: string) => !!userBanStatus?.sites?.some(({ id }) => id === siteID),
    [userBanStatus]
  );

  const [candidateSites, setCandidateSites] = useState<string[]>(() => {
    let all = (userBanStatus?.sites || [])
      .map((bs) => bs.id)
      .concat(banSiteIDs)
      .concat(unbanSiteIDs);

    if (viewerIsScoped) {
      all = all.concat(
        viewer.moderationScopes!.sites!.map((scopeSite) => scopeSite.id)
      );
    }

    return dedupe(all);
  });

  const onUnbanFromSite = useCallback(
    (siteID: string) => {
      const inBanIDs = banSiteIDs.indexOf(siteID) > -1;
      const inUnbanIDs = unbanSiteIDs.indexOf(siteID) > -1;
      const alreadyBanned = !!userBanStatus?.sites?.some(
        ({ id }) => id === siteID
      );

      if (inBanIDs) {
        // remove from banSiteIDs
        setBanSiteIDs(banSiteIDs.filter((id) => id !== siteID));
      }
      if (!inUnbanIDs && alreadyBanned) {
        // add to unbanSiteIDs
        setUnbanSiteIDs([...unbanSiteIDs, siteID]);
      }
    },
    [banSiteIDs, unbanSiteIDs, userBanStatus, setBanSiteIDs, setUnbanSiteIDs]
  );

  const onBanFromSite = useCallback(
    (siteID: string) => {
      const inBanIDs = banSiteIDs.indexOf(siteID) > -1;
      const inUnbanIDs = unbanSiteIDs.indexOf(siteID) > -1;
      const alreadyBanned = !!userBanStatus?.sites?.some(
        ({ id }) => id === siteID
      );
      if (!inBanIDs && !alreadyBanned) {
        // add to banSiteIDs
        setBanSiteIDs([...banSiteIDs, siteID]);
      }
      if (inUnbanIDs) {
        // remove from unbanSiteIDs
        setUnbanSiteIDs(unbanSiteIDs.filter((id) => id !== siteID));
      }
    },
    [banSiteIDs, unbanSiteIDs, setBanSiteIDs, setUnbanSiteIDs, userBanStatus]
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
    [onToggleSite, candidateSites]
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
                banSiteIDs.includes(siteID) ||
                (initiallyBanned(siteID) && !unbanSiteIDs.includes(siteID));

              return (
                <UserStatusSitesListSelectedSiteQuery
                  key={siteID}
                  siteID={siteID}
                  checked={checked}
                  onChange={onToggleSite}
                  disabled={
                    viewerIsScoped && !viewerScopesSiteIDs?.includes(siteID)
                  }
                />
              );
            })}
          </HorizontalGutter>
          {!viewerIsScoped && (
            <SiteSearch
              onSelect={onAddSite}
              showSiteSearchLabel={false}
              showOnlyScopedSitesInSearchResults={true}
              showAllSitesSearchFilterOption={false}
              clearTextFieldValueAfterSelect={true}
            />
          )}
        </FieldSet>
      </IntersectionProvider>
    </>
  );
};

export default UserStatusSitesList;
