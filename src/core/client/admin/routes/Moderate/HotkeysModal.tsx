import {
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
  Typography,
} from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import styles from "./HotkeysModal.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

const HotkeysModal: FunctionComponent<Props> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="banModal-title">
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.root}>
          <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
          <HorizontalGutter size="double">
            <Localized id="hotkeysModal-title">
              <Typography variant="header1">Keyboard shortcuts</Typography>
            </Localized>
            <Flex itemGutter>
              <HorizontalGutter>
                <Localized id="hotkeysModal-navigation-shortcuts">
                  <Typography variant="header3">
                    Navigation shortcuts
                  </Typography>
                </Localized>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>j</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-next">
                    <Typography>Next comment</Typography>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>k</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-prev">
                    <Typography>Previous comment</Typography>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>ctrl+f</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-search">
                    <Typography>Open search</Typography>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>1..4</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-jump">
                    <Typography>Jump to specific queue</Typography>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>t</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-switch">
                    <Typography>Switch queues</Typography>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>z</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-single-view">
                    <Typography>Single comment view</Typography>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>?</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-modal">
                    <Typography>Show shortcuts</Typography>
                  </Localized>
                </Flex>
              </HorizontalGutter>
              <HorizontalGutter>
                <Localized id="hotkeysModal-moderation-decisions">
                  <Typography variant="header3">
                    Moderation decisions
                  </Typography>
                </Localized>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>d</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-approve">
                    <Typography>Approve</Typography>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>f</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-reject">
                    <Typography>Reject</Typography>
                  </Localized>
                </Flex>
              </HorizontalGutter>
            </Flex>
          </HorizontalGutter>
        </Card>
      )}
    </Modal>
  );
};

export default HotkeysModal;
