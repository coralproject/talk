import React, { FunctionComponent } from "react";

import { Card, Flex, Modal } from "coral-ui/components/v2";

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
      {() => (
        <Card className={styles.root}>
          <Flex direction="column">
            {storyID && (
              <StoryInfoDrawerQuery onClose={onClose} storyID={storyID} />
            )}
          </Flex>
        </Card>
      )}
    </Modal>
  );
};

export default StoryInfoDrawer;
