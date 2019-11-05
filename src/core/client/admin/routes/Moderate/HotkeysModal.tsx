import {
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
} from "coral-ui/components/v2";
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
      {({ firstFocusableRef }) => (
        <Card className={styles.root}>
          <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
          <HorizontalGutter size="double">
            <Localized id="hotkeysModal-title">
              <h1 className={styles.title}>Keyboard shortcuts</h1>
            </Localized>
            <Flex itemGutter>
              <HorizontalGutter>
                <Localized id="hotkeysModal-navigation-shortcuts">
                  <div className={styles.subTitle}>Navigation shortcuts</div>
                </Localized>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>j</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-next">
                    <div style={styles.hotKeyAction}>Next comment</div>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>k</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-prev">
                    <div style={styles.hotKeyAction}>Previous comment</div>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>ctrl+f</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-search">
                    <div style={styles.hotKeyAction}>Open search</div>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>1..4</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-jump">
                    <div style={styles.hotKeyAction}>
                      Jump to specific queue
                    </div>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>t</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-switch">
                    <div style={styles.hotKeyAction}>Switch queues</div>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>z</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-zen">
                    <div style={styles.hotKeyAction}>
                      Toggle single-comment view
                    </div>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>?</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-toggle">
                    <div style={styles.hotKeyAction}>Toggle shortcuts help</div>
                  </Localized>
                </Flex>
              </HorizontalGutter>
              <HorizontalGutter>
                <Localized id="hotkeysModal-moderation-decisions">
                  <div className={styles.subTitle}>Moderation decisions</div>
                </Localized>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>f</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-approve">
                    <div className={styles.hotKeyAction}>Approve</div>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>d</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-reject">
                    <div className={styles.hotKeyAction}>Reject</div>
                  </Localized>
                </Flex>
                <Flex>
                  <div className={styles.hotKeyContainer}>
                    <div className={styles.hotKey}>b</div>
                  </div>
                  <Localized id="hotkeysModal-shortcuts-ban">
                    <div className={styles.hotKeyAction}>
                      Ban comment author
                    </div>
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
