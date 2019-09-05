import cn from "classnames";
import { Localized } from "fluent-react/compat";
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
        <Localized id="profile-settings-deleteAccount-pages-downloadCommentHeader">
          <Typography variant="header2" className={styles.headerText}>
            Download my comments?
          </Typography>
        </Localized>
      </Flex>
      <div className={styles.body}>
        <PageStepBar step={step} />

        <Localized id="profile-settings-deleteAccount-pages-downloadCommentsDesc">
          <Typography variant="bodyCopy" className={styles.sectionContent}>
            Before your account is deleted, we recommend you download your
            comment history for your records. After your account is deleted, you
            will be unable to request your comment history.
          </Typography>
        </Localized>
        <Localized id="profile-settings-deleteAccount-pages-downloadCommentsPath">
          <Typography variant="bodyCopyBold" className={styles.sectionContent}>
            My Profile > Download My Comment History
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
            <Localized id="profile-settings-deleteAccount-pages-proceed">
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
            <Localized id="profile-settings-deleteAccount-pages-cancel">
              Cancel
            </Localized>
          </Button>
        </div>
      </div>
    </>
  );
};

export default DownloadCommentsPage;
