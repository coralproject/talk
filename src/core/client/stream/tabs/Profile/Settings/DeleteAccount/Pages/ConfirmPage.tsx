import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button, Flex, Typography } from "coral-ui/components";

import PageStepBar from "./Common/PageStepBar";

import styles from "./Common/Page.css";

interface Props {
  step: number;
  onCancel: () => void;
  onProceed: () => void;
}

const ConfirmPage: FunctionComponent<Props> = ({
  step,
  onCancel,
  onProceed,
}) => {
  const onDeleteClicked = useCallback(() => {
    // TODO: schedule account deletion and validate password

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
        className={styles.header}
      >
        <Localized id="profile-settings-deleteAccount-pages-confirmHeader">
          <Typography variant="header2" className={styles.headerText}>
            Confirm account deletion?
          </Typography>
        </Localized>
      </Flex>
      <div className={styles.body}>
        <PageStepBar step={step} />

        <Localized id="profile-settings-deleteAccount-pages-confirmDescHeader">
          <Typography variant="bodyCopyBold" className={styles.sectionHeader}>
            Are you sure you want to delete your account?
          </Typography>
        </Localized>
        <Localized id="profile-settings-deleteAccount-confirmDescContent">
          <Typography variant="bodyCopy" className={styles.sectionContent}>
            To confirm you would like to delete your account please type in the
            following phrase into the text box below:
          </Typography>
        </Localized>

        <div className={styles.controls}>
          <Button
            variant="filled"
            color="error"
            className={styles.deleteButton}
            onClick={onDeleteClicked}
          >
            <Localized id="profile-settings-deleteAccount-pages-deleteButton">
              Delete my account
            </Localized>
          </Button>
          <Button
            variant="outlined"
            className={styles.cancelButton}
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

export default ConfirmPage;
