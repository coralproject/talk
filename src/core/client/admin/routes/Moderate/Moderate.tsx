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

import styles from "./Moderate.css";

interface Props {
  story: PropTypesOf<typeof ModerateNavigationContainer>["story"] &
    PropTypesOf<typeof ModerateSearchBarContainer>["story"];
  moderationQueues: PropTypesOf<
    typeof ModerateNavigationContainer
  >["moderationQueues"];
  allStories: boolean;
  children?: React.ReactNode;
}

const Moderate: FunctionComponent<Props> = ({
  moderationQueues,
  story,
  allStories,
  children,
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
      <ModerateSearchBarContainer story={story} allStories={allStories} />
      <SubBar data-testid="moderate-tabBar-container">
        <ModerateNavigationContainer
          moderationQueues={moderationQueues}
          story={story}
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
