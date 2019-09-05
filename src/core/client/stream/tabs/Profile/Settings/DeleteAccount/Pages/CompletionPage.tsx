import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import CLASSES from "coral-stream/classes";
import { Button, Flex, Typography } from "coral-ui/components";

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
        <Localized id="profile-account-deleteAccount-pages-completeHeader">
          <Typography variant="header2" className={styles.headerText}>
            Account deletion requested
          </Typography>
        </Localized>
      </Flex>
      <div className={styles.body}>
        <PageStepBar step={step} />

        <Localized id="profile-account-deleteAccount-pages-completeDescript">
          <Typography variant="bodyCopy" className={styles.sectionContent}>
            Your request has been submitted and a confirmation has been sent to
            the email address associated with your account.
          </Typography>
        </Localized>

        <Localized
          id="profile-account-deleteAccount-pages-completeTimeHeader"
          $date={formattedDate}
        >
          <Typography variant="bodyCopyBold" className={styles.sectionContent}>
            Your account will be deleted on: {formattedDate}
          </Typography>
        </Localized>

        <Localized id="profile-account-deleteAccount-pages-completeChangeYourMindHeader">
          <Typography variant="bodyCopyBold" className={styles.sectionHeader}>
            Changed your mind?
          </Typography>
        </Localized>
        <Localized
          id="profile-account-deleteAccount-pages-completeSignIntoYourAccount"
          strong={<strong />}
        >
          <Typography variant="bodyCopy" className={styles.sectionContent}>
            Simply sign in to your account again before this time and select
            <strong>“Cancel Account Deletion Request.”</strong>
          </Typography>
        </Localized>

        <Localized id="profile-account-deleteAccount-pages-completeTellUsWhy">
          <Typography variant="bodyCopyBold" className={styles.sectionHeader}>
            Tell us why.
          </Typography>
        </Localized>
        <Localized
          id="profile-account-deleteAccount-pages-completeWhyDeleteAccount"
          $email={organizationEmail}
        >
          <Typography variant="bodyCopy" className={styles.sectionContent}>
            We'd like to know why you chose to delete your account. Send us
            feedback on our comment system by emailing {organizationEmail}.
          </Typography>
        </Localized>

        <div className={styles.controls}>
          <Button
            variant="filled"
            color="primary"
            fullWidth
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
