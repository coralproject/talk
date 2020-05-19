import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { Link } from "found";
import React, { FunctionComponent } from "react";

import { SectionFilter } from "coral-common/section";

import styles from "./SectionSelectorSection.css";

interface Props {
  section?: SectionFilter;
  active?: boolean;
  link?: string;
}

const SectionSelectorSection: FunctionComponent<Props> = ({
  section,
  link,
  active,
}) => {
  return (
    <Link
      className={cn(styles.root, {
        [styles.active]: active,
      })}
      to={link || ""}
    >
      {!section && (
        <Localized id="moderate-section-selector-allSections">
          <span>All Sections</span>
        </Localized>
      )}
      {section && !section.name && (
        <Localized id="moderate-section-selector-uncategorized">
          <span>Uncategorized</span>
        </Localized>
      )}
      {section && section.name && <span>{section.name}</span>}
    </Link>
  );
};

export default SectionSelectorSection;
