import key from "keymaster";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import MainLayout from "coral-admin/components/MainLayout";
import { HOTKEYS } from "coral-admin/constants";
import { PropTypesOf } from "coral-framework/types";
import { SubBar } from "coral-ui/components/v2/SubBar";

import { useLocal } from "coral-framework/lib/relay";

import HotkeysModal from "./HotkeysModal";
import ModerateNavigationContainer from "./ModerateNavigation";
import ModerateSearchBarContainer from "./ModerateSearchBar";

import { ModerateLocal } from "coral-admin/__generated__/ModerateLocal.graphql";

import styles from "./Moderate.css";
import SiteSelector from "./SiteSelector";

interface Props {
  story: PropTypesOf<typeof ModerateNavigationContainer>["story"] &
    PropTypesOf<typeof ModerateSearchBarContainer>["story"];
  moderationQueues: PropTypesOf<
    typeof ModerateNavigationContainer
  >["moderationQueues"];
  allStories: boolean;
  sites: PropTypesOf<typeof SiteSelector>["sites"];
  children?: React.ReactNode;
}

const Moderate: FunctionComponent<Props> = ({
  moderationQueues,
  story,
  allStories,
  children,
  sites,
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
  const [local, setLocal] = useLocal<ModerateLocal>(
    graphql`
      fragment ModerateLocal on Local {
        siteID
      }
    `
  );

  const selectSite = useCallback(
    (siteID: string | null) => {
      setLocal({ siteID });
    },
    [setLocal]
  );

  return (
    <div data-testid="moderate-container">
      <ModerateSearchBarContainer story={story} allStories={allStories} />
      <SubBar data-testid="moderate-tabBar-container">
        <SiteSelector
          onSelect={selectSite}
          selected={local.siteID}
          sites={sites}
        />
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
