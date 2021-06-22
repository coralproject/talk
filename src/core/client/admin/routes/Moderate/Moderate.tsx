import key from "keymaster";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { HOTKEYS } from "coral-admin/constants";
import { SectionFilter } from "coral-common/section";
import { QUEUE_NAME } from "coral-framework/helpers";
import { PropTypesOf } from "coral-framework/types";
import { SubBar } from "coral-ui/components/v2/SubBar";

import HotkeysModal from "./HotkeysModal";
import ModerateNavigationContainer from "./ModerateNavigation";
import ModerateSearchBarContainer from "./ModerateSearchBar";
import QueueSort from "./Queue/QueueSort/QueueSort";
import { SectionSelectorContainer } from "./SectionSelector";
import { SiteSelectorContainer } from "./SiteSelector";

import styles from "./Moderate.css";

interface RouteParams {
  storyID?: string;
  siteID?: string;
}

interface Props {
  story: PropTypesOf<typeof ModerateNavigationContainer>["story"] &
    PropTypesOf<typeof ModerateSearchBarContainer>["story"];
  query: PropTypesOf<typeof SiteSelectorContainer>["query"] &
    PropTypesOf<typeof SectionSelectorContainer>["query"];
  viewer: PropTypesOf<typeof SiteSelectorContainer>["viewer"];
  moderationQueues: PropTypesOf<
    typeof ModerateNavigationContainer
  >["moderationQueues"];
  allStories: boolean;
  siteID: string | null;
  section?: SectionFilter | null;
  settings:
    | (PropTypesOf<typeof ModerateSearchBarContainer>["settings"] &
        PropTypesOf<typeof SiteSelectorContainer>["settings"] &
        PropTypesOf<typeof ModerateNavigationContainer>["settings"])
    | null;
  children?: React.ReactNode;
  queueName: QUEUE_NAME | undefined;
  routeParams: RouteParams;
}

const Moderate: FunctionComponent<Props> = ({
  moderationQueues,
  story,
  query,
  viewer,
  allStories,
  children,
  queueName,
  routeParams,
  settings,
  siteID,
  section,
}) => {
  const [showHotkeysModal, setShowHotkeysModal] = useState(false);
  const closeModal = useCallback(() => {
    setShowHotkeysModal(false);
  }, []);

  useEffect(() => {
    const toggleModal = () => {
      setShowHotkeysModal((was) => !was);
    };

    // Attach the modal toggle when the GUIDE button is pressed.
    key(HOTKEYS.GUIDE, toggleModal);
    return () => {
      // Detach the modal toggle if we have to rebind it.
      key.unbind(HOTKEYS.GUIDE);
    };
  }, []);

  return (
    <div data-testid="moderate-container">
      <ModerateSearchBarContainer
        story={story}
        settings={settings}
        allStories={allStories}
        siteID={routeParams.siteID || null}
        queueName={queueName}
        siteSelector={
          <SiteSelectorContainer
            queueName={queueName}
            query={query}
            settings={settings}
            viewer={viewer}
            siteID={routeParams.siteID || siteID || null}
          />
        }
        sectionSelector={
          <SectionSelectorContainer
            queueName={queueName}
            query={query}
            section={section}
          />
        }
      />
      <SubBar data-testid="moderate-tabBar-container" className={styles.subBar}>
        <ModerateNavigationContainer
          moderationQueues={moderationQueues}
          story={story}
          siteID={routeParams.siteID || siteID || null}
          section={section}
          settings={settings}
        />
        <QueueSort />
      </SubBar>
      <div className={styles.background} />
      <MainLayout data-testid="moderate-main-container">
        <main className={styles.main}>{children}</main>
      </MainLayout>
      <HotkeysModal open={showHotkeysModal} onClose={closeModal} />
    </div>
  );
};

export default Moderate;
