import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import ModalHeader from "coral-admin/components/ModalHeader";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import { GQLDSAReportDecisionLegality } from "coral-framework/schema";
import {
  Button,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
  Textarea,
} from "coral-ui/components/v2";

import MakeReportDecisionMutation from "./MakeReportDecisionMutation";

import { ReportMakeDecisionModal_dsaReport } from "coral-admin/__generated__/ReportMakeDecisionModal_dsaReport.graphql";

import styles from "./ReportMakeDecisionModal.css";

interface Props {
  dsaReport: ReportMakeDecisionModal_dsaReport;
  showDecisionModal: boolean;
  setShowDecisionModal: (show: boolean) => void;
  userID?: string;
}

const ReportMakeDecisionModal: FunctionComponent<Props> = ({
  dsaReport,
  showDecisionModal,
  setShowDecisionModal,
  userID,
}) => {
  const makeReportDecision = useMutation(MakeReportDecisionMutation);
  const [makeDecisionSelection, setMakeDecisionSelection] =
    useState<null | GQLDSAReportDecisionLegality>(null);
  const onClickMakeDecisionContainsIllegal = useCallback(() => {
    setMakeDecisionSelection(GQLDSAReportDecisionLegality.ILLEGAL);
  }, [setMakeDecisionSelection]);

  const onClickMakeDecisionDoesNotContainIllegal = useCallback(() => {
    setMakeDecisionSelection(GQLDSAReportDecisionLegality.LEGAL);
  }, [setMakeDecisionSelection]);

  const onSubmitDecision = useCallback(
    async (input: { legalGrounds?: string; explanation?: string }) => {
      if (
        dsaReport &&
        userID &&
        dsaReport.comment?.revision &&
        makeDecisionSelection
      ) {
        try {
          await makeReportDecision({
            userID,
            reportID: dsaReport.id,
            legality: makeDecisionSelection,
            legalGrounds:
              makeDecisionSelection === GQLDSAReportDecisionLegality.ILLEGAL
                ? input.legalGrounds
                : undefined,
            detailedExplanation:
              makeDecisionSelection === GQLDSAReportDecisionLegality.ILLEGAL
                ? input.explanation
                : undefined,
            commentID: dsaReport.comment?.id,
            commentRevisionID: dsaReport.comment.revision.id,
          });
          setShowDecisionModal(false);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
    },
    [
      makeReportDecision,
      userID,
      dsaReport,
      makeDecisionSelection,
      setShowDecisionModal,
    ]
  );
  const onCloseDecisionModal = useCallback(() => {
    setShowDecisionModal(false);
  }, [setShowDecisionModal]);
  return (
    <Modal open={showDecisionModal} data-testid="report-makeDecisionModal">
      {({ firstFocusableRef }) => (
        <Card>
          <Flex justifyContent="flex-end">
            <CardCloseButton
              onClick={onCloseDecisionModal}
              ref={firstFocusableRef}
            />
          </Flex>
          <Localized id="reports-decisionModal-header">
            <ModalHeader>Decision</ModalHeader>
          </Localized>
          <Form onSubmit={onSubmitDecision}>
            {({ handleSubmit, hasValidationErrors }) => (
              <form onSubmit={handleSubmit}>
                <Flex direction="column" padding={2}>
                  <HorizontalGutter>
                    <Flex alignItems="center" direction="column">
                      <Localized id="reports-decisionModal-prompt">
                        <div className={styles.decisionModalThisComment}>
                          Does this comment appear to contain illegal content?
                        </div>
                      </Localized>
                      <Flex margin={2}>
                        <Localized id="reports-decisionModal-yes">
                          <Button
                            onClick={onClickMakeDecisionContainsIllegal}
                            active={
                              makeDecisionSelection ===
                              GQLDSAReportDecisionLegality.ILLEGAL
                            }
                            className={styles.yesButton}
                          >
                            Yes
                          </Button>
                        </Localized>
                        <Localized id="reports-decisionModal-no">
                          <Button
                            onClick={onClickMakeDecisionDoesNotContainIllegal}
                            active={
                              makeDecisionSelection ===
                              GQLDSAReportDecisionLegality.LEGAL
                            }
                          >
                            No
                          </Button>
                        </Localized>
                      </Flex>
                    </Flex>
                    {makeDecisionSelection ===
                      GQLDSAReportDecisionLegality.ILLEGAL && (
                      <>
                        <Flex>
                          <Field
                            id="reportLegalGrounds"
                            name="legalGrounds"
                            validate={required}
                          >
                            {({ input }) => (
                              <Textarea
                                className={styles.decisionModalTextArea}
                                placeholder="Legal grounds"
                                {...input}
                              />
                            )}
                          </Field>
                        </Flex>
                        <Flex>
                          <Field
                            id="reportExplanation"
                            name="explanation"
                            validate={required}
                          >
                            {({ input }) => (
                              <Textarea
                                className={styles.decisionModalTextArea}
                                placeholder="Explanation"
                                {...input}
                              />
                            )}
                          </Field>
                        </Flex>
                      </>
                    )}
                    {makeDecisionSelection && (
                      <Flex justifyContent="flex-end">
                        <Localized id="reports-decisionModal-submit">
                          <Button
                            type="submit"
                            iconLeft
                            disabled={hasValidationErrors}
                          >
                            Submit
                          </Button>
                        </Localized>
                      </Flex>
                    )}
                  </HorizontalGutter>
                </Flex>
              </form>
            )}
          </Form>
        </Card>
      )}
    </Modal>
  );
};

const enhanced = withFragmentContainer<Props>({
  dsaReport: graphql`
    fragment ReportMakeDecisionModal_dsaReport on DSAReport {
      id
      comment {
        id
        revision {
          id
        }
      }
    }
  `,
})(ReportMakeDecisionModal);

export default enhanced;
