import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Button } from "coral-ui/components/v2";

import { SiteFilterOption_site } from "coral-admin/__generated__/SiteFilterOption_site.graphql";

import styles from "./SiteFilterOption.css";

interface Props {
  site: SiteFilterOption_site | null;
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

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment SiteFilterOption_site on Site {
      name
      id
    }
  `,
})(SiteFilterOption);

export default enhanced;
