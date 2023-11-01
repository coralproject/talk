import { FormApi } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import ModalHeader from "coral-admin/components/ModalHeader";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
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
  const [makeDecisionSelection, setMakeDecisionSelection] = useState<
    null | string
  >(null);
  const onClickMakeDecisionContainsIllegal = useCallback(() => {
    setMakeDecisionSelection("YES");
  }, [setMakeDecisionSelection]);

  const onClickMakeDecisionDoesNotContainIllegal = useCallback(() => {
    setMakeDecisionSelection("NO");
  }, [setMakeDecisionSelection]);

  const onSubmitDecision = useCallback(
    async (input: any, form: FormApi) => {
      if (dsaReport && userID && dsaReport.comment?.revision) {
        try {
          await makeReportDecision({
            userID,
            reportID: dsaReport.id,
            legality: makeDecisionSelection === "YES" ? "ILLEGAL" : "LEGAL",
            legalGrounds:
              makeDecisionSelection === "YES" ? input.legalGrounds : undefined,
            detailedExplanation:
              makeDecisionSelection === "YES" ? input.explanation : undefined,
            commentID: dsaReport.comment?.id,
            commentRevisionID: dsaReport.comment.revision.id,
            storyID: dsaReport.comment.story.id,
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
    <Modal open={showDecisionModal}>
      {({ firstFocusableRef }) => (
        <Card>
          <Flex justifyContent="flex-end">
            <CardCloseButton
              onClick={onCloseDecisionModal}
              ref={firstFocusableRef}
            />
          </Flex>
          <ModalHeader>Decision</ModalHeader>
          {/* TODO: Localize all of this */}
          <Form
            onSubmit={onSubmitDecision}
            initialValues={{ decision: "ILLEGAL" }}
          >
            {({ handleSubmit, hasValidationErrors }) => (
              <form onSubmit={handleSubmit}>
                <Flex direction="column" padding={2}>
                  <HorizontalGutter>
                    <Flex alignItems="center" direction="column">
                      <div className={styles.decisionModalThisComment}>
                        Does this comment appear to contain illegal content?
                      </div>
                      <Flex margin={2}>
                        <Button
                          onClick={onClickMakeDecisionContainsIllegal}
                          active={makeDecisionSelection === "YES"}
                          className={styles.yesButton}
                        >
                          Yes
                        </Button>
                        <Button
                          onClick={onClickMakeDecisionDoesNotContainIllegal}
                          active={makeDecisionSelection === "NO"}
                        >
                          No
                        </Button>
                      </Flex>
                    </Flex>
                    {makeDecisionSelection === "YES" && (
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
                    {makeDecisionSelection !== null && (
                      <Flex justifyContent="flex-end">
                        <Button
                          type="submit"
                          iconLeft
                          disabled={hasValidationErrors}
                        >
                          Submit
                        </Button>
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
        story {
          id
        }
      }
    }
  `,
})(ReportMakeDecisionModal);

export default enhanced;
