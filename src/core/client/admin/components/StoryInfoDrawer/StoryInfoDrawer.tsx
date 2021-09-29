import React, { FunctionComponent } from "react";

import { Card, Modal } from "coral-ui/components/v2";

import StoryInfoDrawerQuery from "./StoryInfoDrawerQuery";

import styles from "./StoryInfoDrawer.css";

export interface StoryInfoDrawerProps {
  open: boolean;
  storyID?: string;
  setStoryID?: (storyID: string) => void;
  onClose: () => void;
}

const StoryInfoDrawer: FunctionComponent<StoryInfoDrawerProps> = ({
  open,
  onClose,
  setStoryID,
  storyID,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.root}>
          {storyID && (
            <StoryInfoDrawerQuery onClose={onClose} storyID={storyID} />
          )}
        </Card>
      )}
    </Modal>
  );
};

export default StoryInfoDrawer;
