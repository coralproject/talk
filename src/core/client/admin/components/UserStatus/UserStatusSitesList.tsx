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

  const outOfScope = useCallback(
    (siteID: string) =>
      viewerIsScoped &&
      !viewerScopes.sites?.some((scope) => scope.id === siteID),
    [viewerIsScoped, viewerScopes.sites]
  );

  const [candidateSites, setCandidateSites] = useState<string[]>(
    bannedSites.map((bs) => bs.id)
  );

  const { input: updateType } = useField<string>("updateType", {
    initialValue: "ALL_SITES",
  });
  const { input: banSiteIDs } = useField<string[]>("banSiteIDs");
  const { input: unbanSiteIDs } = useField<string[]>("unbanSiteIDs");

  const bannedOutOfScope = new Set(
    bannedSites.filter((bs) => outOfScope(bs.id)).map((bs) => bs.id)
  );

  useEffect(() => {
    const inScopeIDs = bannedSites
      .filter((bs) => !outOfScope(bs.id))
      .map((bs) => bs.id);
    banSiteIDs.onChange(inScopeIDs);
  }, [bannedSites, outOfScope, banSiteIDs]);
  // MARCUS: This is causing an infinite update loop

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
    (id: string, on: boolean) => {
      if (on) {
        onBanFromSite(id);
      } else {
        onUnbanFromSite(id);
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

          {(viewerIsAdmin ||
            viewerIsOrgAdmin ||
            (viewerIsScoped && !viewerIsSingleSiteMod)) && (
            <Flex className={styles.sitesToggle} spacing={5}>
              <FormField>
                <Localized id="community-banModal-allSites">
                  <RadioButton
                    checked={updateType.value === "ALL_SITES"}
                    onChange={() => updateType.onChange("ALL_SITES")}
                  >
                    All sites
                  </RadioButton>
                </Localized>
              </FormField>
              <FormField>
                <Localized id="community-banModal-specificSites">
                  <RadioButton
                    checked={updateType.value === "SPECIFIC_SITES"}
                    onChange={() => updateType.onChange("SPECIFIC_SITES")}
                  >
                    Specific Sites
                  </RadioButton>
                </Localized>
              </FormField>
              <FormField>
                <Localized id="community-banModal-noSites">
                  <RadioButton
                    checked={updateType.value === "NO_SITES"}
                    onChange={() => updateType.onChange("NO_SITES")}
                  >
                    All sites
                  </RadioButton>
                </Localized>
              </FormField>
            </Flex>
          )}

          {updateType.value === "SPECIFIC_SITES" && (
            <>
              <HorizontalGutter spacing={3} mt={5} mb={4}>
                {candidateSites.map((siteID) => {
                  const checked =
                    banSiteIDs.value.includes(siteID) ||
                    bannedOutOfScope.has(siteID);

                  return (
                    <UserStatusSitesListSelectedSiteQuery
                      key={siteID}
                      siteID={siteID}
                      checked={checked}
                      onChange={onToggleSite}
                      disabled={outOfScope(siteID)}
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
