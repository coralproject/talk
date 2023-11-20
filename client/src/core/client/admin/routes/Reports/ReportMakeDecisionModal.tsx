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
  InputLabel,
  Modal,
  Textarea,
  TextField,
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
            <ModalHeader>Report decision</ModalHeader>
          </Localized>
          <Form onSubmit={onSubmitDecision}>
            {({ handleSubmit, hasValidationErrors }) => (
              <form onSubmit={handleSubmit}>
                <Flex direction="column" paddingTop={2}>
                  <HorizontalGutter>
                    <Flex alignItems="center" direction="column">
                      <Localized id="reports-decisionModal-prompt">
                        <div className={styles.decisionModalThisComment}>
                          Does this comment appear to contain illegal content?
                        </div>
                      </Localized>
                      <Flex margin={2} className={styles.buttonWrapper}>
                        <Localized id="reports-decisionModal-yes">
                          <Button
                            variant="outlined"
                            fullWidth
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
                            variant="outlined"
                            fullWidth
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
                              <Flex direction="column" className={styles.input}>
                                <Localized id="reports-decisionModal-lawBrokenLabel">
                                  <InputLabel
                                    htmlFor={input.name}
                                    className={styles.inputLabel}
                                  >
                                    Law broken
                                  </InputLabel>
                                </Localized>
                                <Localized
                                  id="reports-decisionModal-lawBrokenTextfield"
                                  attrs={{ placeholder: true }}
                                >
                                  <TextField
                                    className={styles.decisionModalTextArea}
                                    placeholder="Add law..."
                                    {...input}
                                  />
                                </Localized>
                              </Flex>
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
                              <Flex direction="column" className={styles.input}>
                                <Localized id="reports-decisionModal-detailedExplanationLabel">
                                  <InputLabel
                                    htmlFor={input.name}
                                    className={styles.inputLabel}
                                  >
                                    Detailed explanation
                                  </InputLabel>
                                </Localized>
                                <Localized
                                  id="reports-decisionModal-detailedExplanationTextarea"
                                  attrs={{ placeholder: true }}
                                >
                                  <Textarea
                                    className={styles.decisionModalTextArea}
                                    placeholder="Add explanation..."
                                    {...input}
                                  />
                                </Localized>
                              </Flex>
                            )}
                          </Field>
                        </Flex>
                      </>
                    )}
                    <Flex justifyContent="flex-end">
                      <Localized id="reports-decisionModal-submit">
                        <Button
                          type="submit"
                          iconLeft
                          disabled={
                            hasValidationErrors || !makeDecisionSelection
                          }
                        >
                          Submit
                        </Button>
                      </Localized>
                    </Flex>
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
