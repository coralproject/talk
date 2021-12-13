import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { useField } from "react-final-form";

import SiteSearch from "coral-admin/components/SiteSearch";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import { FieldSet, HorizontalGutter, Label } from "coral-ui/components/v2";

import { USER_ROLE } from "coral-admin/__generated__/UserStatusChangeContainer_viewer.graphql";

import { dedupe } from "./helpers";
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

export interface UserBanStatus {
  sites: ReadonlyArray<ScopeSite> | null;
  active: boolean | null;
}

interface Props {
  readonly userBanStatus?: UserBanStatus;
  viewerScopes: Scopes;
}

const UserStatusSitesList: FunctionComponent<Props> = ({
  viewerScopes,
  userBanStatus,
}) => {
  const viewerIsScoped = !!viewerScopes.sites && viewerScopes.sites.length > 0;

  const initiallyBanned = useCallback(
    (siteID: string) => !!userBanStatus?.sites?.some(({ id }) => id === siteID),
    [userBanStatus]
  );

  const { input: banSiteIDsInput } = useField<string[]>("banSiteIDs");

  const { input: unbanSiteIDsInput } = useField<string[]>("unbanSiteIDs");

  const [candidateSites, setCandidateSites] = useState<string[]>(() => {
    let all = (userBanStatus?.sites || [])
      .map((bs) => bs.id)
      .concat(banSiteIDsInput.value)
      .concat(unbanSiteIDsInput.value);

    if (viewerIsScoped) {
      all = all.concat(viewerScopes.sites!.map((scopeSite) => scopeSite.id));
    }

    return dedupe(all);
  });

  const onUnbanFromSite = useCallback(
    (siteID: string) => {
      const inBanIDs = banSiteIDsInput.value.indexOf(siteID) > -1;
      const inUnbanIDs = unbanSiteIDsInput.value.indexOf(siteID) > -1;
      const alreadyBanned = !!userBanStatus?.sites?.some(
        ({ id }) => id === siteID
      );

      if (inBanIDs) {
        // remove from banSiteIDs
        banSiteIDsInput.onChange(
          banSiteIDsInput.value.filter((id) => id !== siteID)
        );
      }
      if (!inUnbanIDs && alreadyBanned) {
        // add to unbanSiteIDs
        unbanSiteIDsInput.onChange([...unbanSiteIDsInput.value, siteID]);
      }
    },
    [banSiteIDsInput, unbanSiteIDsInput, userBanStatus]
  );

  const onBanFromSite = useCallback(
    (siteID: string) => {
      const inBanIDs = banSiteIDsInput.value.indexOf(siteID) > -1;
      const inUnbanIDs = unbanSiteIDsInput.value.indexOf(siteID) > -1;
      const alreadyBanned = !!userBanStatus?.sites?.some(
        ({ id }) => id === siteID
      );
      if (!inBanIDs && !alreadyBanned) {
        // add to banSiteIDs
        banSiteIDsInput.onChange([...banSiteIDsInput.value, siteID]);
      }
      if (inUnbanIDs) {
        // remove from unbanSiteIDs
        unbanSiteIDsInput.onChange(
          unbanSiteIDsInput.value.filter((id) => id !== siteID)
        );
      }
    },
    [banSiteIDsInput, unbanSiteIDsInput, userBanStatus]
  );

  const onToggleSite = useCallback(
    (siteID: string, ban: boolean) => {
      if (ban) {
        onBanFromSite(siteID);
      } else {
        onUnbanFromSite(siteID);
      }
    },
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
              const selectedForBan = banSiteIDsInput.value.includes(siteID);
              const selectedForUnban = unbanSiteIDsInput.value.includes(siteID);
              const alreadyBanned = initiallyBanned(siteID);
              const checked =
                selectedForBan || (alreadyBanned && !selectedForUnban);

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
          {!viewerIsScoped && (
            <SiteSearch
              onSelect={onAddSite}
              showSiteSearchLabel={false}
              showOnlyScopedSitesInSearchResults={true}
              showAllSitesSearchFilterOption={false}
            />
          )}
        </FieldSet>
      </IntersectionProvider>
    </>
  );
};

export default UserStatusSitesList;
