import { Localized } from "@fluent/react/compat";
import { FormApi } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { required } from "coral-framework/lib/validation";
import { GQLDSAReportHistoryType } from "coral-framework/schema";
import { AddIcon, BinIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import {
  Button,
  Flex,
  HorizontalGutter,
  Textarea,
} from "coral-ui/components/v2";

import {
  DSAReportDecisionLegality,
  DSAReportStatus,
  ReportHistory_dsaReport,
} from "coral-admin/__generated__/ReportHistory_dsaReport.graphql";

import styles from "./ReportHistory.css";

import AddReportNoteMutation from "./AddReportNoteMutation";
import DeleteReportNoteMutation from "./DeleteReportNoteMutation";

interface Props {
  dsaReport: ReportHistory_dsaReport;
  userID?: string;
}

// TODO: Add localization strings
// could share with reportstatusmenu localizations?
export const statusMappings = {
  AWAITING_REVIEW: "Awaiting review",
  UNDER_REVIEW: "In review",
  COMPLETED: "Completed",
  "%future added value": "Unknown status",
};

// TODO: Add localizations here
const decisionMadeMapping = {
  ILLEGAL: "contains illegal content",
  LEGAL: "does not contain illegal content",
  "%future added value": "Unknown decision",
};

const ReportHistory: FunctionComponent<Props> = ({ dsaReport, userID }) => {
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

  const decisionMapping = useCallback(
    (decision?: DSAReportDecisionLegality | null) => {
      if (!decision) {
        return "Unknown decision";
      }
      return decisionMadeMapping[decision];
    },
    []
  );

  const onDeleteReportNoteButton = useCallback(
    async (id: string) => {
      await deleteReportNote({ id, reportID: dsaReport.id });
    },
    [deleteReportNote, dsaReport.id]
  );

  const onSubmit = useCallback(
    async (input: any, form: FormApi) => {
      if (userID) {
        await addReportNote({
          body: input.note,
          reportID: dsaReport.id,
          userID,
        });
        form.change("note", undefined);
      }
    },
    [addReportNote, dsaReport, userID]
  );

  if (!dsaReport) {
    return null;
  }

  return (
    <Flex direction="column" className={styles.reportHistoryWrapper}>
      <Flex className={styles.reportHistory} direction="column">
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
                      <Localized
                        id="reports-singleReport-changedStatus"
                        vars={{
                          status: statusMapping(h.status),
                          username: h.createdBy?.username,
                        }}
                      >
                        <div className={styles.reportHistoryText}>{`${
                          h.createdBy?.username
                        } changed status to "${statusMapping(h.status)}"`}</div>
                      </Localized>
                    )}

                    {h?.type === GQLDSAReportHistoryType.SHARE && (
                      <Localized
                        id="reports-singleReport-sharedReport"
                        vars={{ username: h.createdBy?.username }}
                      >
                        <div
                          className={styles.reportHistoryText}
                        >{`${h.createdBy?.username} shared this report`}</div>
                      </Localized>
                    )}

                    {h?.type === GQLDSAReportHistoryType.DECISION_MADE && (
                      <Localized
                        id="reports-singleReport-madeDecision"
                        vars={{ username: h.createdBy?.username }}
                      >
                        <div className={styles.reportHistoryText}>{`${
                          h.createdBy?.username
                        } made a decision that this report ${decisionMapping(
                          h.decision?.legality
                        )}`}</div>
                      </Localized>
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
      </Flex>
      <Flex>
        <Form onSubmit={onSubmit}>
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
