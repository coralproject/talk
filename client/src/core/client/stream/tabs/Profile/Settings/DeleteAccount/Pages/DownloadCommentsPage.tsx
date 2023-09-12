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

const DownloadCommentsPage: FunctionComponent<Props> = ({
  step,
  onCancel,
  onProceed,
}) => {
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
            <div
              className={cn(
                styles.subHeaderText,
                CLASSES.deleteMyAccountModal.subHeaderText
              )}
            >
              Delete my account
            </div>
          </Localized>
          <Localized id="profile-account-deleteAccount-pages-downloadSubHeader">
            <div
              className={cn(
                styles.headerText,
                CLASSES.deleteMyAccountModal.headerText
              )}
            >
              Download my comments
            </div>
          </Localized>
        </div>
      </Flex>
      <div className={cn(styles.body, CLASSES.deleteMyAccountModal.body)}>
        <PageStepBar step={step} />

        <Localized id="profile-account-deleteAccount-pages-downloadCommentsDesc">
          <div
            className={cn(
              styles.sectionContent,
              CLASSES.deleteMyAccountModal.sectionContent
            )}
          >
            Before your account is deleted, we recommend you download your
            comment history for your records. After your account is deleted, you
            will be unable to request your comment history.
          </div>
        </Localized>
        <Localized id="profile-account-deleteAccount-pages-downloadCommentsPath">
          <div
            className={cn(
              styles.sectionHeader,
              CLASSES.deleteMyAccountModal.sectionHeader
            )}
          >
            My Profile &gt; Download My Comment History
          </div>
        </Localized>

        <div className={styles.controls}>
          <Button
            variant="filled"
            color="secondary"
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
            color="secondary"
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

export default DownloadCommentsPage;
