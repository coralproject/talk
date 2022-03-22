import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { useField } from "react-final-form";

import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";
import { Label } from "coral-ui/components/v2";

import SiteSearch from "../SiteSearch";
import SiteRoleModalSelectedSiteQuery from "./SiteRoleModalSelectedSiteQuery";

interface Props {
  selectedSiteIDs?: string[];
  roleToBeSet: GQLUSER_ROLE_RL | null;
}

const SiteRoleModalSites: FunctionComponent<Props> = ({
  selectedSiteIDs,
  roleToBeSet,
}) => {
  const [candidateSites, setCandidateSites] = useState<string[]>(
    selectedSiteIDs || []
  );

  const { input: siteIDsInput } = useField<string[]>("siteIDs");

  const onRemoveSite = useCallback(
    (siteID: string) => {
      const changed = [...siteIDsInput.value];
      const index = changed.indexOf(siteID);
      if (index >= 0) {
        changed.splice(index, 1);
      }
      siteIDsInput.onChange(changed);
    },
    [siteIDsInput]
  );

  const onAddSite = useCallback(
    (siteID: string) => {
      const changed = [...siteIDsInput.value];
      const index = changed.indexOf(siteID);
      if (index === -1) {
        changed.push(siteID);
        if (!candidateSites.includes(siteID)) {
          setCandidateSites([...candidateSites, siteID]);
        }
      }

      siteIDsInput.onChange(changed);
    },
    [candidateSites, siteIDsInput]
  );
  const onToggle = useCallback(
    (siteID: string, checked: boolean) =>
      checked ? onRemoveSite(siteID) : onAddSite(siteID),
    [onAddSite, onRemoveSite]
  );

  return (
    <>
      {roleToBeSet === GQLUSER_ROLE.MODERATOR && (
        <Localized id="community-siteRoleModal-selectSites-siteModerator">
          <Label>Select sites to moderate</Label>
        </Localized>
      )}
      {roleToBeSet === GQLUSER_ROLE.MEMBER && (
        <Localized id="community-siteRoleModal-selectSites-member">
          <Label>Select sites for this user to be a member of</Label>
        </Localized>
      )}
      {candidateSites.map((siteID) => {
        const checked = siteIDsInput.value.includes(siteID);
        return (
          <SiteRoleModalSelectedSiteQuery
            key={siteID}
            siteID={siteID}
            checked={checked}
            onChange={onToggle}
          />
        );
      })}
      <SiteSearch
        showSiteSearchLabel={false}
        showAllSitesSearchFilterOption={false}
        showOnlyScopedSitesInSearchResults={true}
        onSelect={onAddSite}
        clearTextFieldValueAfterSelect={true}
      />
    </>
  );
};

export default SiteRoleModalSites;
