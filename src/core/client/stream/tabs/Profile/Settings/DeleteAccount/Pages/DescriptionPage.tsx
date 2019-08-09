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

const DescriptionPage: FunctionComponent<Props> = ({
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
        className={styles.header}
      >
        <Localized id="profile-settings-deleteAccount-pages-descriptionHeader">
          <Typography variant="header2" className={styles.headerText}>
            Delete my account?
          </Typography>
        </Localized>
      </Flex>
      <div className={styles.body}>
        <PageStepBar step={step} />
        <Localized id="profile-settings-deleteAccount-pages-descriptionText">
          <Typography variant="bodyCopy">
            You are attempting to delete your account. This means:
          </Typography>
        </Localized>
        <ul className={styles.ul}>
          <li>
            <Localized id="profile-settings-deleteAccount-pages-list1">
              <Typography variant="bodyCopy">
                All of your comments are removed from this site
              </Typography>
            </Localized>
          </li>
          <li>
            <Localized id="profile-settings-deleteAccount-pages-list2">
              <Typography variant="bodyCopy">
                All of your comments are deleted from our database
              </Typography>
            </Localized>
          </li>
          <li>
            <Localized id="profile-settings-deleteAccount-pages-list3">
              <Typography variant="bodyCopy">
                Your username and email address are removed from our system
              </Typography>
            </Localized>
          </li>
        </ul>
        <div className={styles.controls}>
          <Button
            variant="filled"
            color="primary"
            className={styles.proceedButton}
            onClick={onProceedClicked}
          >
            <Localized id="profile-settings-deleteAccount-pages-proceed">
              Proceed
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

export default DescriptionPage;
