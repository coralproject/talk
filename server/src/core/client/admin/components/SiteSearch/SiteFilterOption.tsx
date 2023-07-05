import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Button } from "coral-ui/components/v2";

import styles from "./SiteFilterOption.css";

interface Props {
  site: { name: string; id: string } | null;
  onClick: (site: { name: string; id: string } | null) => void;
  active: boolean;
}

const SiteFilterOption: FunctionComponent<Props> = ({
  site,
  active,
  onClick,
}) => {
  const root = cn(styles.root, {
    [styles.active]: active,
  });
  return (
    <Button
      uppercase={false}
      color="mono"
      variant="text"
      onClick={() => onClick(site)}
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
