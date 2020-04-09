import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import PageStepBar from "./Common/PageStepBar";

import styles from "./Common/Page.css";

interface Props {
  step: number;
  onCancel: () => void;
  onProceed: () => void;
}

const WhenPage: FunctionComponent<Props> = ({ step, onCancel, onProceed }) => {
  const onProceedClicked = useCallback(() => {
    onProceed();
  }, [onProceed]);
  const onCancelClicked = useCallback(() => {
    onCancel();
  }, [onProceed]);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        className={cn(styles.header, CLASSES.deleteMyAccountModal.header)}
      >
        <div className={styles.headerContent}>
          <Localized id="profile-account-deleteAccount-pages-sharedHeader">
            <div className={styles.subHeaderText}>Delete my account</div>
          </Localized>
          <Localized id="profile-account-deleteAccount-pages-whenSubHeader">
            <div className={styles.headerText}>When?</div>
          </Localized>
        </div>
      </Flex>
      <div className={styles.body}>
        <PageStepBar step={step} />

        <Localized id="profile-account-deleteAccount-pages-whenSec1Header">
          <div className={styles.sectionHeader}>
            When will my account be deleted?
          </div>
        </Localized>
        <Localized id="profile-account-deleteAccount-pages-whenSec1Content">
          <div className={styles.sectionContent}>
            Your account will be deleted 24 hours after your request has been
            submitted.
          </div>
        </Localized>
        <Localized id="profile-account-deleteAccount-pages-whenSec2Header">
          <div className={styles.sectionHeader}>
            Can I still write comments until my account is deleted?
          </div>
        </Localized>
        <Localized id="profile-account-deleteAccount-pages-whenSec2Content">
          <div className={styles.sectionContent}>
            No. Once you've requested account deletion, you can no longer write
            comments, reply to comments, or select reactions.
          </div>
        </Localized>

        <div className={styles.controls}>
          <Button
            variant="filled"
            color="mono"
            upperCase
            className={cn(
              styles.proceedButton,
              CLASSES.deleteMyAccountModal.proceedButton
            )}
            onClick={onProceedClicked}
          >
            <Localized id="profile-account-deleteAccount-pages-proceed">
              Proceed
            </Localized>
          </Button>
          <Button
            variant="outlined"
            color="mono"
            upperCase
            className={cn(
              styles.cancelButton,
              CLASSES.deleteMyAccountModal.cancelButton
            )}
            onClick={onCancelClicked}
          >
            <Localized id="profile-account-deleteAccount-pages-cancel">
              Cancel
            </Localized>
          </Button>
        </div>
      </div>
    </>
  );
};

export default WhenPage;
