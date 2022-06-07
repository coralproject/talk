import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import PaginatedSelect from "coral-admin/components/PaginatedSelect";
import { SectionFilter } from "coral-common/section";
import { getModerationLink, QUEUE_NAME } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
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

const findSiteID = (window: Window) => {
  const siteRegex = new RegExp(
    "/sites/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
  );
  const url = window.location.href;
  const match = url.search(siteRegex);

  if (match !== -1) {
    return url.substring(match + 7, url.length);
  }

  return null;
};

const SectionSelector: FunctionComponent<Props> = ({
  sections,
  section,
  queueName: queue,
}) => {
  const { window } = useCoralContext();
  const siteID = findSiteID(window);

  return (
    <PaginatedSelect
      disableLoadMore
      className={styles.button}
      selected={<SelectedSection section={section} />}
    >
      <SectionSelectorSection
        active={!section}
        link={
          siteID
            ? getModerationLink({ queue, siteID })
            : getModerationLink({ queue })
        }
      />
      <SectionSelectorSection
        section={{ name: null }}
        active={!!section && !section.name}
        link={
          siteID
            ? getModerationLink({ queue, section: { name: null }, siteID })
            : getModerationLink({ queue, section: { name: null } })
        }
      />
      {sections.length > 0 && <Divider />}
      {sections.map((name) => (
        <SectionSelectorSection
          key={name}
          section={{ name }}
          active={!!section && section.name === name}
          link={
            siteID
              ? getModerationLink({ queue, section: { name }, siteID })
              : getModerationLink({ queue, section: { name } })
          }
        />
      ))}
    </PaginatedSelect>
  );
};

export default SectionSelector;
