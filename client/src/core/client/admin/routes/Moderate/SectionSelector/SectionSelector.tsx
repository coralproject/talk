import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import PaginatedSelect from "coral-admin/components/PaginatedSelect";
import { SectionFilter } from "coral-common/section";
import { getModerationLink, QUEUE_NAME } from "coral-framework/helpers";
import { Divider } from "coral-ui/components/v2/Dropdown";

import SectionSelectorSection from "./SectionSelectorSection";

import styles from "./SectionSelector.css";

interface Props {
  sections: ReadonlyArray<string>;
  section?: SectionFilter | null;
  queueName: QUEUE_NAME | undefined;
}

const SelectedSection: FunctionComponent<{
  section?: SectionFilter | null;
}> = ({ section }) => {
  if (!section) {
    return (
      <Localized id="moderate-section-selector-allSections">
        <span className={styles.buttonText}>All Sections</span>
      </Localized>
    );
  }

  if (!section.name) {
    return (
      <Localized id="moderate-section-selector-uncategorized">
        <span className={styles.buttonText}>Uncategorized</span>
      </Localized>
    );
  }

  return <span className={styles.buttonText}>{section.name}</span>;
};

const SectionSelector: FunctionComponent<Props> = ({
  sections,
  section,
  queueName: queue,
}) => {
  return (
    <PaginatedSelect
      disableLoadMore
      className={styles.button}
      selected={<SelectedSection section={section} />}
    >
      <SectionSelectorSection
        active={!section}
        link={getModerationLink({ queue })}
      />
      <SectionSelectorSection
        section={{ name: null }}
        active={!!section && !section.name}
        link={getModerationLink({ queue, section: { name: null } })}
      />
      {sections.length > 0 && <Divider />}
      {sections.map((name) => (
        <SectionSelectorSection
          key={name}
          section={{ name }}
          active={!!section && section.name === name}
          link={getModerationLink({ queue, section: { name } })}
        />
      ))}
    </PaginatedSelect>
  );
};

export default SectionSelector;
