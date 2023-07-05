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
        <Localized id="profile-account-deleteAccount-pages-sharedHeader">
          <div
            className={cn(
              styles.headerText,
              CLASSES.deleteMyAccountModal.headerText
            )}
          >
            Delete my account
          </div>
        </Localized>
      </Flex>
      <div className={cn(styles.body, CLASSES.deleteMyAccountModal.body)}>
        <PageStepBar step={step} />
        <Localized id="profile-account-deleteAccount-pages-descriptionText">
          <div>You are attempting to delete your account. This means:</div>
        </Localized>
        <ul className={styles.ul}>
          <li>
            <Localized id="profile-account-deleteAccount-pages-allCommentsRemoved">
              <span>All of your comments are removed from this site</span>
            </Localized>
          </li>
          <li>
            <Localized id="profile-account-deleteAccount-pages-allCommentsDeleted">
              <span>All of your comments are deleted from our database</span>
            </Localized>
          </li>
          <li>
            <Localized id="profile-account-deleteAccount-pages-emailRemoved">
              <span>Your email address is removed from our system</span>
            </Localized>
          </li>
        </ul>
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

export default DescriptionPage;
