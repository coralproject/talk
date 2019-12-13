import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Option, SelectField } from "coral-ui/components/v2";

import SiteSelectorSite from "./SiteSelectorSite";

interface Props {
  sites: Array<{ id: string } & PropTypesOf<typeof SiteSelectorSite>["site"]>;
  onSelect: (siteID: string | null) => void;
  selected: string | null;
}

const SiteSelector: FunctionComponent<Props> = ({
  sites,
  onSelect,
  selected,
}) => {
  return (
    <SelectField
      onChange={e => onSelect((e.target.value as any) || null)}
      value={selected || "all"}
    >
      <Option value="all">All sites</Option>
      {sites.map(site => (
        <SiteSelectorSite site={site} key={site.id} />
      ))}
    </SelectField>
  );
};

export default SiteSelector;
