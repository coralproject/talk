import { Localized } from "@fluent/react/compat";
import { FormApi } from "final-form";
import { RouteProps } from "found";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import {
  CommentContent,
  InReplyTo,
  UsernameButton,
} from "coral-admin/components/Comment";
import { MediaContainer } from "coral-admin/components/MediaContainer";
import CommentAuthorContainer from "coral-admin/components/ModerateCard/CommentAuthorContainer";
import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation } from "coral-framework/lib/relay";
import { createRouteConfig } from "coral-framework/lib/router";
import { required } from "coral-framework/lib/validation";
import {
  GQLDSAReportHistoryType,
  GQLDSAReportStatus,
} from "coral-framework/schema";
import { AddIcon, BinIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import {
  Button,
  Flex,
  HorizontalGutter,
  Textarea,
  Timestamp,
} from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import {
  DSAReportStatus,
  SingleReportRouteQueryResponse,
} from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./SingleReportRoute.css";

import NotFound from "../NotFound";
import AddReportNoteMutation from "./AddReportNoteMutation";
import AddReportShareMutation from "./AddReportShareMutation";
import ChangeReportStatusMutation from "./ChangeReportStatusMutation";
import DeleteReportNoteMutation from "./DeleteReportNoteMutation";
import ReportStatusMenu from "./ReportStatusMenu";

type Props = SingleReportRouteQueryResponse;

// TODO: Add localization strings
export const statusMappings = {
  AWAITING_REVIEW: "Awaiting review",
  UNDER_REVIEW: "In review",
  COMPLETED: "Completed",
  "%future added value": "Unknown status",
};

const SingleReportRoute: FunctionComponent<Props> & {
  routeConfig: RouteProps;
} = ({ dsaReport, viewer }) => {
  const comment = dsaReport?.comment;
  const { window } = useCoralContext();

  const addReportNote = useMutation(AddReportNoteMutation);
  const changeReportStatus = useMutation(ChangeReportStatusMutation);
  const deleteReportNote = useMutation(DeleteReportNoteMutation);
  const addReportShare = useMutation(AddReportShareMutation);

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

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

  const inReplyTo = comment && comment.parent && comment.parent.author;

  const [userDrawerUserID, setUserDrawerUserID] = useState<string | undefined>(
    undefined
  );
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);

  const onShowUserDrawer = useCallback(
    (userID: string | null | undefined) => {
      if (userID) {
        setUserDrawerUserID(userID);
        setUserDrawerVisible(true);
      }
    },
    [setUserDrawerUserID, setUserDrawerVisible]
  );

  const onHideUserDrawer = useCallback(() => {
    setUserDrawerVisible(false);
    setUserDrawerUserID(undefined);
  }, [setUserDrawerUserID, setUserDrawerVisible]);

  const onSetUserID = useCallback(
    (userID: string) => {
      setUserDrawerUserID(userID);
    },
    [setUserDrawerUserID]
  );

  const onSubmit = useCallback(
    async (input: any, form: FormApi) => {
      if (dsaReport?.id && viewer?.id) {
        await addReportNote({
          body: input.note,
          reportID: dsaReport.id,
          userID: viewer.id,
        });
        form.change("note", undefined);
      }
    },
    [addReportNote, dsaReport, viewer]
  );

  const onChangeStatus = useCallback(
    async (status: GQLDSAReportStatus) => {
      if (dsaReport?.id && viewer?.id) {
        await changeReportStatus({
          reportID: dsaReport?.id,
          userID: viewer.id,
          status,
        });
      }
    },
    [dsaReport, viewer, changeReportStatus]
  );

  const onDeleteReportNoteButton = useCallback(
    async (id: string) => {
      if (dsaReport?.id) {
        await deleteReportNote({ id, reportID: dsaReport.id });
      }
    },
    [deleteReportNote, dsaReport]
  );

  const onShareButtonClick = useCallback(async () => {
    if (dsaReport && viewer?.id) {
      // TODO: Will need to localize this
      // Also determine what should be included; also comment info and report history?
      const reportInfo = `Reference ID: ${dsaReport.referenceID}\nReporter: ${
        dsaReport.reporter?.username
      }\nReport date: ${formatter(
        dsaReport.createdAt
      )}\nWhat law was broken?: ${
        dsaReport.lawBrokenDescription
      }\nExplanation: ${dsaReport.additionalInformation}`;
      const element = window.document.createElement("a");
      const file = new Blob([reportInfo], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      // TODO: Should have date/time added since could be downloaded more than once?
      element.download = `dsaReport-${dsaReport?.referenceID}`;
      window.document.body.appendChild(element);
      element.click();

      await addReportShare({ reportID: dsaReport.id, userID: viewer.id });
    }
  }, [dsaReport, window, addReportShare, formatter, viewer]);

  if (!dsaReport) {
    return <NotFound />;
  }

  return (
    // TODO: Localize all the labels in here
    <div className={styles.root}>
      <Flex className={styles.header}>
        <Flex direction="column">
          <Localized id="reports-singleReport-reportID">
            <div className={styles.label}>Report ID</div>
          </Localized>
          <div>{dsaReport.referenceID}</div>
        </Flex>
        <Flex
          className={styles.statusAndShare}
          justifyContent="flex-end"
          alignItems="center"
        >
          <ReportStatusMenu
            onChange={onChangeStatus}
            value={dsaReport.status}
          />
          <Localized id="reports-singleReport-shareButton">
            <Button
              className={styles.shareButton}
              variant="outlined"
              color="regular"
              uppercase
              target="_blank"
              rel="noreferrer"
              onClick={onShareButtonClick}
            >
              Share
            </Button>
          </Localized>
        </Flex>
      </Flex>
      <Flex>
        <Flex className={styles.reportMain}>
          <Flex className={styles.innerMain} direction="column">
            <HorizontalGutter spacing={5}>
              <Flex>
                <Flex direction="column">
                  <Localized id="reports-singleReport-reporter">
                    <div className={styles.label}>Reporter</div>
                  </Localized>
                  {dsaReport.reporter ? (
                    <Button
                      className={styles.reporterUsernameButton}
                      variant="text"
                      color="mono"
                      uppercase={false}
                      onClick={() => onShowUserDrawer(dsaReport.reporter?.id)}
                    >
                      <div>{dsaReport.reporter.username}</div>
                    </Button>
                  ) : (
                    <Localized id="reports-singleReport-reporterNameNotAvailable">
                      <div>Reporter name not available</div>
                    </Localized>
                  )}
                </Flex>
                <Flex className={styles.reportDate} direction="column">
                  <Localized id="reports-singleReport-reportDate">
                    <div className={styles.label}>Report Date</div>
                  </Localized>
                  <div className={styles.data}>
                    {formatter(dsaReport.createdAt)}
                  </div>
                </Flex>
              </Flex>
              <Flex>
                <Flex direction="column">
                  <Localized id="reports-singleReport-lawBroken">
                    <div className={styles.label}>What law was broken?</div>
                  </Localized>
                  <div className={styles.data}>
                    {dsaReport.lawBrokenDescription}
                  </div>
                </Flex>
              </Flex>
              <Flex>
                <Flex direction="column">
                  <Localized id="reports-singleReport-explanation">
                    <div className={styles.label}>Explanation</div>
                  </Localized>
                  <div className={styles.data}>
                    {dsaReport.additionalInformation}
                  </div>
                </Flex>
              </Flex>
              <Flex>
                {comment && (
                  <Flex direction="column" className={styles.commentMain}>
                    <Localized id="reports-singleReport-comment">
                      <div className={styles.label}>Comment</div>
                    </Localized>
                    <Flex className={styles.commentBox}>
                      <div>
                        <div>
                          <Flex alignItems="center">
                            {comment.author?.username && (
                              <>
                                <UsernameButton
                                  className={styles.commentUsernameButton}
                                  username={comment.author.username}
                                  onClick={() =>
                                    onShowUserDrawer(comment.author?.id)
                                  }
                                />
                                <CommentAuthorContainer comment={comment} />
                              </>
                            )}
                            <Timestamp>{comment.createdAt}</Timestamp>
                            {comment.editing.edited && (
                              <Localized id="reports-singleReport-comment-edited">
                                <span className={styles.edited}>(edited)</span>
                              </Localized>
                            )}
                          </Flex>
                          {inReplyTo && inReplyTo.username && (
                            <InReplyTo
                              className={styles.reportUsername}
                              onUsernameClick={() =>
                                onShowUserDrawer(inReplyTo.id)
                              }
                            >
                              {inReplyTo.username}
                            </InReplyTo>
                          )}
                        </div>
                        {comment.rating && (
                          <div>
                            <StarRating rating={comment.rating} />
                          </div>
                        )}
                        <div>
                          <div>
                            {/* Add in the deleted account backup in moderatecardcontainer */}
                            <CommentContent
                              className={styles.commentContent}
                              // TODO: determine highlight
                              // highlight={highlight}
                              bannedWords={
                                comment.revision?.metadata?.wordList
                                  ?.bannedWords || []
                              }
                              suspectWords={
                                comment.revision?.metadata?.wordList
                                  ?.suspectWords || []
                              }
                            >
                              {comment.body || ""}
                            </CommentContent>
                            <MediaContainer comment={comment} />
                          </div>
                        </div>
                        <div>
                          <HorizontalGutter spacing={3}>
                            <div>
                              <div>
                                <Localized id="reports-singleReport-commentOn">
                                  <span className={styles.label}>
                                    Comment on
                                  </span>
                                </Localized>
                                <span>:</span>
                              </div>
                              <div>
                                <span className={styles.storyTitle}>
                                  {/* TODO: Not available backup */}
                                  {comment.story?.metadata?.title ?? ""}
                                </span>
                              </div>
                            </div>
                          </HorizontalGutter>
                        </div>
                      </div>
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </HorizontalGutter>
          </Flex>
        </Flex>
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
                          } changed status to "${statusMapping(
                            h.status
                          )}"`}</div>
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
          <Form onSubmit={onSubmit}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Localized id="reports-singleReport-note-field">
                  <Field
                    id="reportHistory-note"
                    name="note"
                    validate={required}
                  >
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
      <UserHistoryDrawer
        userID={userDrawerUserID}
        open={userDrawerVisible}
        onClose={onHideUserDrawer}
        setUserID={onSetUserID}
      />
    </div>
  );
};

SingleReportRoute.routeConfig = createRouteConfig<
  Props,
  SingleReportRouteQueryResponse
>({
  query: graphql`
    query SingleReportRouteQuery($reportID: ID!) {
      viewer {
        id
      }
      dsaReport(id: $reportID) {
        history {
          id
          createdBy {
            username
          }
          createdAt
          body
          type
          status
        }
        id
        referenceID
        lawBrokenDescription
        additionalInformation
        createdAt
        status
        reporter {
          id
          username
        }
        comment {
          body
          story {
            metadata {
              title
            }
          }
          rating
          parent {
            author {
              id
              username
            }
          }
          createdAt
          editing {
            edited
          }
          author {
            id
            username
          }
          revision {
            metadata {
              wordList {
                bannedWords {
                  value
                  index
                  length
                }
                suspectWords {
                  value
                  index
                  length
                }
              }
            }
          }
          ...CommentAuthorContainer_comment
          ...MediaContainer_comment
        }
      }
    }
  `,
  Component: SingleReportRoute,
  cacheConfig: { force: true },
  render: function SingleReportRouteRender({ Component, data }) {
    if (Component && data) {
      return <Component {...data} />;
    }
    // Loading of some sort?
    return <>Not found</>;
  },
});

export default SingleReportRoute;
