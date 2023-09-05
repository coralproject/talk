import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { Link } from "found";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { SiteSelectorSite_site } from "coral-admin/__generated__/SiteSelectorSite_site.graphql";

import styles from "./SiteSelectorSite.css";

interface Props {
  site: SiteSelectorSite_site | null;
  active?: boolean;
  link?: string;
}

const SiteSelectorSite: FunctionComponent<Props> = ({ site, link, active }) => {
  return (
    <Link
      className={cn(styles.root, {
        [styles.active]: active,
      })}
      to={link || ""}
    >
      {site ? (
        site.name
      ) : (
        <Localized id="sites-selector-allSites">All sites</Localized>
      )}
    </Link>
  );
};

const enhanced = withFragmentContainer<Props>({
  site: graphql`
    fragment SiteSelectorSite_site on Site {
      name
      id
    }
  `,
})(SiteSelectorSite);

export default enhanced;
