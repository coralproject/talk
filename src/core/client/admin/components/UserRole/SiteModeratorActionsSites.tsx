import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useField } from "react-final-form";

import { CheckBox, ListGroup, ListGroupRow } from "coral-ui/components/v2";

interface Props {
  viewerSites: ReadonlyArray<{ readonly id: string; readonly name: string }>;
  userSites?: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
  }> | null;
  mode: string | null;
}

const SiteModeratorActionsSites: FunctionComponent<Props> = ({
  viewerSites,
  userSites,
  mode,
}) => {
  const { input: siteIDsInput } = useField<string[]>("siteIDs");
  const candidateSites = mode === "promote" ? viewerSites : userSites || [];

  useEffect(() => {
    siteIDsInput.onChange(userSites?.map((site) => site.id));
  }, []);

  const onAddSite = useCallback(
    (siteID: string) => {
      const changed = [...siteIDsInput.value];
      const index = changed.indexOf(siteID);
      if (index === -1) {
        changed.push(siteID);
      }
      siteIDsInput.onChange(changed);
    },
    [siteIDsInput]
  );

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

  const onToggle = useCallback(
    (siteID: string, checked: boolean) =>
      checked ? onRemoveSite(siteID) : onAddSite(siteID),
    [onAddSite, onRemoveSite]
  );
  return (
    <ListGroup>
      {candidateSites.map((site) => {
        const checked = siteIDsInput.value.includes(site.id);
        return (
          <ListGroupRow key={site.id}>
            <CheckBox
              checked={checked}
              disabled={
                mode === "promote"
                  ? userSites?.map((s) => s.id).includes(site.id)
                  : !userSites?.map((s) => s.id).includes(site.id)
              }
              onChange={() => {
                onToggle(site.id, checked);
              }}
            >
              {site.name}
            </CheckBox>
          </ListGroupRow>
        );
      })}
    </ListGroup>
  );
};

export default SiteModeratorActionsSites;
