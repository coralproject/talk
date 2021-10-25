import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { Button } from "coral-ui/components/v2";

import { SiteSearchListContainer_query } from "coral-admin/__generated__/SiteSearchListContainer_query.graphql";

import styles from "./SiteFilterOption.css";

interface Props {
  site: SiteSearchListContainer_query["sites"]["edges"][0]["node"] | null;
  onSelect: (id: string | null) => void;
  active: boolean;
  setSearchFilter: (filter: string) => void;
}

const SiteFilterOption: FunctionComponent<Props> = ({
  site,
  onSelect,
  active,
  setSearchFilter,
}) => {
  const root = cn(styles.root, {
    [styles.active]: active,
  });
  const onClick = useCallback(() => {
    onSelect(site ? site.id : null);
    setSearchFilter(site ? site.name : "");
  }, [site]);
  return (
    <Button
      uppercase={false}
      color="mono"
      variant="text"
      onClick={onClick}
      className={root}
    >
      {site && site.name}
      {!site && (
        <Localized id="site-filter-option-allSites">
          <span>All sites</span>
        </Localized>
      )}
    </Button>
  );
};

export default SiteFilterOption;
