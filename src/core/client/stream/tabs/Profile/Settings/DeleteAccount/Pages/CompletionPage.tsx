import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import PageStepBar from "./Common/PageStepBar";

import styles from "./Common/Page.css";

interface Props {
  scheduledDeletionDate?: string;
  organizationEmail: string;
  step: number;
  onClose: () => void;
}

const CompletionPage: FunctionComponent<Props> = ({
  scheduledDeletionDate,
  organizationEmail,
  step,
  onClose,
}) => {
  const onDoneClicked = useCallback(() => {
    onClose();
  }, [onClose]);

  const { locales } = useCoralContext();

  const formattedDate = scheduledDeletionDate
    ? Intl.DateTimeFormat(locales, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date(scheduledDeletionDate))
    : "";

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
          <Localized id="profile-account-deleteAccount-pages-completeSubHeader">
            <div
              className={cn(
                styles.headerText,
                CLASSES.deleteMyAccountModal.headerText
              )}
            >
              Request submitted
            </div>
          </Localized>
        </div>
      </Flex>
      <div className={cn(styles.body, CLASSES.deleteMyAccountModal.body)}>
        <PageStepBar step={step} />

        <Localized id="profile-account-deleteAccount-pages-completeDescript">
          <div
            className={cn(
              styles.sectionContent,
              CLASSES.deleteMyAccountModal.sectionContent
            )}
          >
            Your request has been submitted and a confirmation has been sent to
            the email address associated with your account.
          </div>
        </Localized>

        <Localized
          id="profile-account-deleteAccount-pages-completeTimeHeader"
          $date={formattedDate}
        >
          <div
            className={cn(
              styles.sectionContent,
              CLASSES.deleteMyAccountModal.sectionContent
            )}
          >
            Your account will be deleted on: {formattedDate}
          </div>
        </Localized>

        <Localized id="profile-account-deleteAccount-pages-completeChangeYourMindHeader">
          <div className={styles.sectionHeader}>Changed your mind?</div>
        </Localized>
        <Localized
          id="profile-account-deleteAccount-pages-completeSignIntoYourAccount"
          strong={<strong />}
        >
          <div
            className={cn(
              styles.sectionContent,
              CLASSES.deleteMyAccountModal.sectionContent
            )}
          >
            Simply sign in to your account again before this time and select
            <strong>“Cancel Account Deletion Request.”</strong>
          </div>
        </Localized>

        <Localized id="profile-account-deleteAccount-pages-completeTellUsWhy">
          <div className={styles.sectionHeader}>Tell us why.</div>
        </Localized>
        <Localized
          id="profile-account-deleteAccount-pages-completeWhyDeleteAccount"
          $email={organizationEmail}
        >
          <div
            className={cn(
              styles.sectionContent,
              CLASSES.deleteMyAccountModal.sectionContent
            )}
          >
            We'd like to know why you chose to delete your account. Send us
            feedback on our comment system by emailing {organizationEmail}.
          </div>
        </Localized>

        <div className={styles.controls}>
          <Button
            variant="filled"
            color="secondary"
            fullWidth
            upperCase
            onClick={onDoneClicked}
            className={CLASSES.deleteMyAccountModal.doneButton}
          >
            <Localized id="profile-account-deleteAccount-pages-done">
              Done
            </Localized>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CompletionPage;
