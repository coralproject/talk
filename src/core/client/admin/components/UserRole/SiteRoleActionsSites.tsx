import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from "react";
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

const SiteRoleActionsSites: FunctionComponent<Props> = ({
  viewerSites,
  userSites,
  mode,
}) => {
  const { input: siteIDsInput } = useField<string[]>("siteIDs");
  const userScopedSitesInViewerScope = userSites?.filter((s) =>
    viewerSites.find(({ id }) => s.id === id)
  );
  const candidateSites = useMemo(
    () =>
      mode === "promote" ? viewerSites : userScopedSitesInViewerScope || [],
    []
  );

  useEffect(() => {
    siteIDsInput.onChange(candidateSites.map((site) => site.id));
  }, [candidateSites]); // TODO (marcushaddon): can we avoid this by supplying initialValues to our form parent?

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
        const siteIsAlreadyIncludedInUserScopes = userSites
          ?.map((s) => s.id)
          .includes(site.id);

        return (
          <ListGroupRow key={site.id}>
            <CheckBox
              checked={checked}
              disabled={mode === "promote" && siteIsAlreadyIncludedInUserScopes}
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

export default SiteRoleActionsSites;
