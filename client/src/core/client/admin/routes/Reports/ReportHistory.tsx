import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi } from "final-form";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { useInView } from "coral-framework/lib/intersection";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import {
  GQLDSAReportDecisionLegality,
  GQLDSAReportHistoryType,
  GQLDSAReportStatus,
} from "coral-framework/schema";
import { AddIcon, BinIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import {
  Button,
  Flex,
  HorizontalGutter,
  Textarea,
} from "coral-ui/components/v2";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";

import {
  DSAReportStatus,
  ReportHistory_dsaReport,
} from "coral-admin/__generated__/ReportHistory_dsaReport.graphql";

import styles from "./ReportHistory.css";

import AddReportNoteMutation from "./AddReportNoteMutation";
import DeleteReportNoteMutation from "./DeleteReportNoteMutation";

interface Props {
  dsaReport: ReportHistory_dsaReport;
  setShowChangeStatusModal: (show: boolean) => void;
  userID?: string;
}

// TODO: Add localization strings
// could share with reportstatusmenu localizations?
export const statusMappings = {
  AWAITING_REVIEW: "Awaiting review",
  UNDER_REVIEW: "In review",
  COMPLETED: "Completed",
  VOID: "Void",
  "%future added value": "Unknown status",
};

const ReportHistory: FunctionComponent<Props> = ({
  dsaReport,
  userID,
  setShowChangeStatusModal,
}) => {
  const root = useShadowRootOrDocument();
  const [reportHistoryStyles, setReportHistoryStyles] = useState(
    cn(styles.reportHistory, styles.fadeBottom)
  );
  const { inView, intersectionRef: bottomOfReportHistoryInViewRef } =
    useInView();

  useEffect(() => {
    if (inView) {
      setReportHistoryStyles(styles.reportHistory);
    } else {
      setReportHistoryStyles(cn(styles.reportHistory, styles.fadeBottom));
    }
  }, [inView]);

  const addReportNote = useMutation(AddReportNoteMutation);
  const deleteReportNote = useMutation(DeleteReportNoteMutation);

  const reportHistoryFormatter = useDateTimeFormatter({
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // TODO: Localization
  const statusMapping = useCallback((status: DSAReportStatus | null) => {
    if (!status) {
      return "Unknown status";
    }
    return statusMappings[status];
  }, []);

  const onDeleteReportNoteButton = useCallback(
    async (id: string) => {
      await deleteReportNote({ id, reportID: dsaReport.id });
    },
    [deleteReportNote, dsaReport.id]
  );

  const onSubmitAddNote = useCallback(
    async (input: any, form: FormApi) => {
      if (userID) {
        await addReportNote({
          body: input.note,
          reportID: dsaReport.id,
          userID,
        });
        form.change("note", undefined);
        // Wait for new note to appear then scroll down to it
        setTimeout(() => {
          const element = root.getElementById("reportHistory");
          if (element) {
            element.scroll({ top: element.scrollHeight, behavior: "smooth" });
          }
        }, 0);
        if (dsaReport.status === GQLDSAReportStatus.AWAITING_REVIEW) {
          setShowChangeStatusModal(true);
        }
      }
    },
    [addReportNote, dsaReport, userID, setShowChangeStatusModal, root]
  );

  if (!dsaReport) {
    return null;
  }

  return (
    <Flex direction="column" className={styles.reportHistoryWrapper}>
      <Flex
        className={reportHistoryStyles}
        direction="column"
        id="reportHistory"
      >
        <Localized id="reports-singleReport-history">
          <div className={styles.reportHistoryHeader}>History</div>
        </Localized>
        <HorizontalGutter spacing={3} paddingBottom={4}>
          <div>
            <Localized id="reports-singleReport-history-reportSubmitted">
              <div className={styles.reportHistoryText}>
                Illegal content report submitted
              </div>
            </Localized>
            <div className={styles.reportHistoryCreatedAt}>
              {reportHistoryFormatter(dsaReport.createdAt)}
            </div>
          </div>
          <>
            {dsaReport.history?.map((h) => {
              if (h) {
                return (
                  <div key={h.id}>
                    {h?.type === GQLDSAReportHistoryType.NOTE && (
                      <>
                        <Localized
                          id="reports-singleReport-history-addedNote"
                          vars={{ username: h.createdBy?.username }}
                        >
                          <div
                            className={styles.reportHistoryText}
                          >{`${h.createdBy?.username} added a note`}</div>
                        </Localized>
                        <div className={styles.reportHistoryNoteBody}>
                          {h.body}
                        </div>
                        <div>
                          <Localized
                            id="reports-singleReport-history-deleteNoteButton"
                            elems={{ icon: <ButtonSvgIcon Icon={BinIcon} /> }}
                          >
                            <Button
                              className={styles.deleteReportNoteButton}
                              iconLeft
                              variant="text"
                              color="mono"
                              uppercase={false}
                              onClick={() => onDeleteReportNoteButton(h.id)}
                            >
                              <ButtonSvgIcon Icon={BinIcon} /> Delete
                            </Button>
                          </Localized>
                        </div>
                      </>
                    )}

                    {h?.type === GQLDSAReportHistoryType.STATUS_CHANGED && (
                      <>
                        {h.status === GQLDSAReportStatus.VOID ? (
                          <Localized id="reports-singleReport-reportVoid">
                            <div className={styles.reportHistoryText}>
                              User deleted their account. Report is void.
                            </div>
                          </Localized>
                        ) : (
                          <Localized
                            id="reports-singleReport-history-changedStatus"
                            vars={{
                              status: statusMapping(h.status),
                              username: h.createdBy?.username,
                            }}
                          >
                            <div className={styles.reportHistoryText}>{`${
                              h.createdBy?.username
                            } changed status to "${statusMapping(
                              h.status
                            )}"`}</div>
                          </Localized>
                        )}
                      </>
                    )}

                    {h?.type === GQLDSAReportHistoryType.SHARE && (
                      <Localized
                        id="reports-singleReport-history-sharedReport"
                        vars={{ username: h.createdBy?.username }}
                      >
                        <div
                          className={styles.reportHistoryText}
                        >{`${h.createdBy?.username} shared this report`}</div>
                      </Localized>
                    )}

                    {h?.type === GQLDSAReportHistoryType.DECISION_MADE && (
                      <>
                        {h.decision?.legality ===
                        GQLDSAReportDecisionLegality.ILLEGAL ? (
                          <Localized
                            id="reports-singleReport-history-madeDecision-illegal"
                            vars={{
                              username: h.createdBy?.username,
                            }}
                          >
                            <div
                              className={styles.reportHistoryText}
                            >{`${h.createdBy?.username} made a decision that this report contains illegal content`}</div>
                          </Localized>
                        ) : (
                          <Localized
                            id="reports-singleReport-history-madeDecision-legal"
                            vars={{
                              username: h.createdBy?.username,
                            }}
                          >
                            <div
                              className={styles.reportHistoryText}
                            >{`${h.createdBy?.username} made a decision that this report does not contain illegal content`}</div>
                          </Localized>
                        )}
                        {h.decision?.legality === "ILLEGAL" && (
                          <>
                            <Localized
                              id="reports-singleReport-history-legalGrounds"
                              vars={{ legalGrounds: h.decision?.legalGrounds }}
                            >
                              <div className={styles.reportHistoryText}>
                                Legal grounds: {`${h.decision?.legalGrounds}`}
                              </div>
                            </Localized>
                            <Localized
                              id="reports-singleReport-history-explanation"
                              vars={{
                                explanation: h.decision?.detailedExplanation,
                              }}
                            >
                              <div className={styles.reportHistoryText}>
                                Explanation:{" "}
                                {`${h.decision?.detailedExplanation}`}
                              </div>
                            </Localized>
                          </>
                        )}
                      </>
                    )}

                    <div className={styles.reportHistoryCreatedAt}>
                      {reportHistoryFormatter(h.createdAt)}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </>
        </HorizontalGutter>
        <div ref={bottomOfReportHistoryInViewRef}></div>
      </Flex>
      <Flex className={styles.addNoteFormWrapper}>
        <Form onSubmit={onSubmitAddNote}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className={styles.addNoteForm}>
              <Localized id="reports-singleReport-note-field">
                <Field id="reportHistory-note" name="note" validate={required}>
                  {({ input }) => (
                    <Textarea
                      className={styles.addNoteTextarea}
                      placeholder="Add your note..."
                      {...input}
                    />
                  )}
                </Field>
              </Localized>
              <Flex justifyContent="flex-end">
                <Localized
                  id="reports-singleReport-addUpdateButton"
                  elems={{ icon: <ButtonSvgIcon size="xs" Icon={AddIcon} /> }}
                >
                  <Button type="submit" iconLeft>
                    <ButtonSvgIcon size="xs" Icon={AddIcon} />
                    Add update
                  </Button>
                </Localized>
              </Flex>
            </form>
          )}
        </Form>
      </Flex>
    </Flex>
  );
};

const enhanced = withFragmentContainer<Props>({
  dsaReport: graphql`
    fragment ReportHistory_dsaReport on DSAReport {
      id
      status
      createdAt
      history {
        id
        createdBy {
          username
        }
        createdAt
        body
        type
        status
        decision {
          legality
          legalGrounds
          detailedExplanation
        }
      }
    }
  `,
})(ReportHistory);

export default enhanced;
