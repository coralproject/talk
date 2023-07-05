import React, { FunctionComponent, useCallback } from "react";
import { useField } from "react-final-form";

import { CheckBox, ListGroup, ListGroupRow } from "coral-ui/components/v2";

interface Props {
  viewerSites: ReadonlyArray<{ readonly id: string; readonly name: string }>;
  userSites?: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
  }> | null;
}

const SiteRoleActionsSites: FunctionComponent<Props> = ({
  viewerSites,
  userSites,
}) => {
  const { input: scopeAdditionsInput } = useField<string[]>("scopeAdditions");
  const { input: scopeDeletionsInput } = useField<string[]>("scopeDeletions");

  const onToggle = useCallback(
    (siteID: string, wasChecked: boolean) => {
      const checked = !wasChecked;
      const userHasSite = userSites?.find(({ id }) => id === siteID);
      if (userHasSite && !checked) {
        scopeDeletionsInput.onChange([...scopeDeletionsInput.value, siteID]);
      } else {
        scopeDeletionsInput.onChange(
          scopeDeletionsInput.value.filter((id) => id !== siteID)
        );
      }

      if (!userHasSite && checked) {
        scopeAdditionsInput.onChange([...scopeAdditionsInput.value, siteID]);
      } else {
        scopeAdditionsInput.onChange(
          scopeAdditionsInput.value.filter((id) => id !== siteID)
        );
      }
    },
    [scopeAdditionsInput, scopeDeletionsInput, userSites]
  );
  return (
    <ListGroup>
      {viewerSites.map((site) => {
        const checked =
          scopeAdditionsInput.value.includes(site.id) ||
          (!!userSites?.find(({ id }) => id === site.id) &&
            !scopeDeletionsInput.value.find((id) => id === site.id));

        return (
          <ListGroupRow key={site.id}>
            <CheckBox
              checked={checked}
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
