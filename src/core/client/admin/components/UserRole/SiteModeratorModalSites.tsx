import React, { FunctionComponent, useCallback, useState } from "react";
import { useField } from "react-final-form";

import SiteSearch from "../SiteSearch";
import SiteModeratorModalSelectedSiteQuery from "./SiteModeratorModalSelectedSiteQuery";

interface Props {
  selectedSiteIDs?: string[];
}

const SiteModeratorModalSites: FunctionComponent<Props> = ({
  selectedSiteIDs,
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
    [siteIDsInput]
  );
  const onToggle = useCallback(
    (siteID: string, checked: boolean) =>
      checked ? onRemoveSite(siteID) : onAddSite(siteID),
    [onAddSite, onRemoveSite]
  );

  return (
    <>
      {candidateSites.map((siteID) => {
        const checked = siteIDsInput.value.includes(siteID);
        return (
          <SiteModeratorModalSelectedSiteQuery
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
      />
    </>
  );
};

export default SiteModeratorModalSites;
