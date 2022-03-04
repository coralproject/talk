import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { Link } from "found";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { SiteSelectorSite_site$key as SiteSelectorSite_site } from "coral-admin/__generated__/SiteSelectorSite_site.graphql";

import styles from "./SiteSelectorSite.css";

interface Props {
  site: SiteSelectorSite_site | null;
  active?: boolean;
  link?: string;
}

const SiteSelectorSite: FunctionComponent<Props> = ({ site, link, active }) => {
  const siteData = useFragment(
    graphql`
      fragment SiteSelectorSite_site on Site {
        name
        id
      }
    `,
    site
  );

  return (
    <Link
      className={cn(styles.root, {
        [styles.active]: active,
      })}
      to={link || ""}
    >
      {siteData ? (
        siteData.name
      ) : (
        <Localized id="sites-selector-allSites">All sites</Localized>
      )}
    </Link>
  );
};

export default SiteSelectorSite;
