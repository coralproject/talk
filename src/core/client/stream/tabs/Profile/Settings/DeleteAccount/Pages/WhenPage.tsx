import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Typography } from "coral-ui/components";

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
        <Localized id="profile-account-deleteAccount-pages-whenHeader">
          <Typography variant="header2" className={styles.headerText}>
            Delete my account: When?
          </Typography>
        </Localized>
      </Flex>
      <div className={styles.body}>
        <PageStepBar step={step} />

        <Localized id="profile-account-deleteAccount-pages-whenSec1Header">
          <Typography variant="bodyCopyBold" className={styles.sectionHeader}>
            When will my account be deleted?
          </Typography>
        </Localized>
        <Localized id="profile-account-deleteAccount-pages-whenSec1Content">
          <Typography variant="bodyCopy" className={styles.sectionContent}>
            Your account will be deleted 24 hours after your request has been
            submitted.
          </Typography>
        </Localized>
        <Localized id="profile-account-deleteAccount-pages-whenSec2Header">
          <Typography variant="bodyCopyBold" className={styles.sectionHeader}>
            Can I still write comments until my account is deleted?
          </Typography>
        </Localized>
        <Localized id="profile-account-deleteAccount-pages-whenSec2Content">
          <Typography variant="bodyCopy" className={styles.sectionContent}>
            No. Once you've requested account deletion, you can no longer write
            comments, reply to comments, or select reactions.
          </Typography>
        </Localized>

        <div className={styles.controls}>
          <Button
            variant="filled"
            color="primary"
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
