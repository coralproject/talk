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
        className={cn(styles.header, CLASSES.deleteMyAccountModal.header)}
      >
        <Localized id="profile-account-deleteAccount-pages-descriptionHeader">
          <Typography variant="header2" className={styles.headerText}>
            Delete my account?
          </Typography>
        </Localized>
      </Flex>
      <div className={styles.body}>
        <PageStepBar step={step} />
        <Localized id="profile-account-deleteAccount-pages-descriptionText">
          <Typography variant="bodyCopy">
            You are attempting to delete your account. This means:
          </Typography>
        </Localized>
        <ul className={styles.ul}>
          <li>
            <Localized id="profile-account-deleteAccount-pages-allCommentsRemoved">
              <Typography variant="bodyCopy">
                All of your comments are removed from this site
              </Typography>
            </Localized>
          </li>
          <li>
            <Localized id="profile-account-deleteAccount-pages-allCommentsDeleted">
              <Typography variant="bodyCopy">
                All of your comments are deleted from our database
              </Typography>
            </Localized>
          </li>
          <li>
            <Localized id="profile-account-deleteAccount-pages-emailRemoved">
              <Typography variant="bodyCopy">
                Your email address is removed from our system
              </Typography>
            </Localized>
          </li>
        </ul>
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

export default DescriptionPage;
