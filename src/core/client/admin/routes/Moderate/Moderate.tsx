import key from "keymaster";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { HOTKEYS } from "coral-admin/constants";
import { PropTypesOf } from "coral-framework/types";
import { SubBar } from "coral-ui/components/v2/SubBar";

import HotkeysModal from "./HotkeysModal";
import ModerateNavigationContainer from "./ModerateNavigation";
import ModerateSearchBarContainer from "./ModerateSearchBar";
import { SiteSelectorContainer } from "./SiteSelector";

import styles from "./Moderate.css";

interface RouteParams {
  storyID?: string;
  siteID?: string;
}

interface Props {
  story: PropTypesOf<typeof ModerateNavigationContainer>["story"] &
    PropTypesOf<typeof ModerateSearchBarContainer>["story"];
  site:
    | { id: string } & PropTypesOf<typeof ModerateNavigationContainer>["site"] &
        PropTypesOf<typeof SiteSelectorContainer>["site"]
    | null;
  query: PropTypesOf<typeof SiteSelectorContainer>["query"];
  moderationQueues: PropTypesOf<
    typeof ModerateNavigationContainer
  >["moderationQueues"];
  allStories: boolean;
  settings: PropTypesOf<typeof ModerateSearchBarContainer>["settings"] | null;
  children?: React.ReactNode;
  queueName: string;
  routeParams: RouteParams;
}

const Moderate: FunctionComponent<Props> = ({
  moderationQueues,
  story,
  site,
  query,
  allStories,
  children,
  queueName,
  routeParams,
  settings,
}) => {
  const [showHotkeysModal, setShowHotkeysModal] = useState(false);
  const closeModal = useCallback(() => {
    setShowHotkeysModal(false);
  }, []);

  useEffect(() => {
    const toggleModal = () => {
      setShowHotkeysModal(was => !was);
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
        siteSelector={
          <SiteSelectorContainer
            queueName={queueName}
            site={site}
            query={query}
          />
        }
      />
      <SubBar data-testid="moderate-tabBar-container">
        <ModerateNavigationContainer
          moderationQueues={moderationQueues}
          story={story}
          site={story ? null : site}
        />
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
