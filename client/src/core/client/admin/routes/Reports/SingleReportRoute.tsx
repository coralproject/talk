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
import { BinIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import {
  Button,
  Flex,
  HorizontalGutter,
  Textarea,
  Timestamp,
} from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import { SingleReportRouteQueryResponse } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./SingleReportRoute.css";

import NotFound from "../NotFound";
import ReportStatusMenu from "./ReportStatusMenu";

import AddReportNoteMutation from "./AddReportNoteMutation";
import ChangeReportStatusMutation from "./ChangeReportStatusMutation";
import DeleteReportNoteMutation from "./DeleteReportNoteMutation";

type Props = SingleReportRouteQueryResponse;

const SingleReportRoute: FunctionComponent<Props> & {
  routeConfig: RouteProps;
} = (props) => {
  const { dsaReport, viewer } = props;
  const comment = dsaReport?.comment;
  const { window } = useCoralContext();

  const addReportNote = useMutation(AddReportNoteMutation);
  const changeReportStatus = useMutation(ChangeReportStatusMutation);
  const deleteReportNote = useMutation(DeleteReportNoteMutation);

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
  const statusMapping = useCallback(
    (
      status:
        | "AWAITING_REVIEW"
        | "UNDER_REVIEW"
        | "COMPLETED"
        | "%future added value"
        | null
    ) => {
      if (!status) {
        return "Unknown status";
      }
      const statuses = {
        AWAITING_REVIEW: "Awaiting review",
        UNDER_REVIEW: "In review",
        COMPLETED: "Completed",
        "%future added value": "Unknown status",
      };
      return statuses[status];
    },
    []
  );

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

  // TODO: Update on add note
  const onSubmit = useCallback(
    async (input: any) => {
      if (dsaReport?.id && viewer?.id) {
        await addReportNote({
          body: input.note,
          reportID: dsaReport.id,
          userID: viewer.id,
        });
      }
    },
    [addReportNote, dsaReport, viewer]
  );

  // TODO: Update on change status
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
    [deleteReportNote]
  );

  const onShareButtonClick = useCallback(() => {
    if (dsaReport) {
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

      // TODO: Also add an item to report history that it was downloaded in this case
    }
  }, [dsaReport, window]);

  if (!dsaReport) {
    return <NotFound />;
  }

  return (
    // TODO: Localize all the labels in here
    <div className={styles.root}>
      <Flex className={styles.header}>
        <Flex direction="column">
          <div className={styles.label}>Report ID</div>
          <div>{dsaReport.referenceID}</div>
        </Flex>
        <Flex
          className={styles.statusAndShare}
          justifyContent="flex-end"
          alignItems="center"
        >
          {/* TODO: Actually change report status with this */}
          <ReportStatusMenu
            onChange={onChangeStatus}
            value={dsaReport.status}
          />
          {/* TODO: Should download report when clicked */}
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
        </Flex>
      </Flex>
      <Flex>
        <Flex className={styles.reportMain}>
          <Flex className={styles.innerMain} direction="column">
            <HorizontalGutter spacing={5}>
              <Flex>
                <Flex direction="column">
                  <div className={styles.label}>Reporter</div>
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
                    <>Report name not available</>
                  )}
                </Flex>
                <Flex className={styles.reportDate} direction="column">
                  <div className={styles.label}>Report Date</div>
                  <div className={styles.data}>
                    {formatter(dsaReport.createdAt)}
                  </div>
                </Flex>
              </Flex>
              <Flex>
                <Flex direction="column">
                  <div className={styles.label}>What law was broken?</div>
                  <div className={styles.data}>
                    {dsaReport.lawBrokenDescription}
                  </div>
                </Flex>
              </Flex>
              <Flex>
                <Flex direction="column">
                  <div className={styles.label}>Explanation</div>
                  <div className={styles.data}>
                    {dsaReport.additionalInformation}
                  </div>
                </Flex>
              </Flex>
              <Flex>
                {comment && (
                  <Flex direction="column" className={styles.commentMain}>
                    <div className={styles.label}>Comment</div>

                    <Flex className={styles.commentBox}>
                      <div>
                        <div>
                          <Flex alignItems="center">
                            {comment.author?.username && (
                              <>
                                <UsernameButton
                                  username={comment.author.username}
                                  // onClick={commentAuthorClick}
                                  onClick={() =>
                                    onShowUserDrawer(comment.author?.id)
                                  }
                                />
                                <CommentAuthorContainer comment={comment} />
                              </>
                            )}
                            <Timestamp>{comment.createdAt}</Timestamp>
                            {comment.editing.edited && (
                              // <Localized id="moderate-comment-edited">
                              <span>(edited)</span>
                              // </Localized>
                            )}
                          </Flex>
                          {inReplyTo && inReplyTo.username && (
                            <InReplyTo
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
                                {/* <Localized id="moderate-comment-storyLabel"> */}
                                <span>Comment on</span>
                                {/* </Localized> */}
                                <span>:</span>
                              </div>
                              <div>
                                <span>
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
          <div className={styles.reportHistoryHeader}>History</div>
          <HorizontalGutter spacing={3} paddingBottom={4}>
            <div>
              <div className={styles.reportHistoryText}>
                Illegal content report submitted
              </div>
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
                          {/* TODO: Localize */}
                          <div
                            className={styles.reportHistoryText}
                          >{`${h.createdBy?.username} added a note`}</div>
                          <div className={styles.reportHistoryNoteBody}>
                            {h.body}
                          </div>
                          {/* TODO: Add in ability to delete the note */}
                          <Button
                            variant="text"
                            color="mono"
                            uppercase={false}
                            onClick={() => onDeleteReportNoteButton(h.id)}
                          >
                            <ButtonSvgIcon Icon={BinIcon} /> Delete
                          </Button>
                        </>
                      )}

                      {h?.type === GQLDSAReportHistoryType.STATUS_CHANGED && (
                        // TODO: Make new status human-readable
                        <>
                          <div className={styles.reportHistoryText}>{`${
                            h.createdBy?.username
                          } changed status to "${statusMapping(
                            h.status
                          )}"`}</div>
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
          {/* TODO: Need to add a success state here once note is submitted */}
          <Form onSubmit={onSubmit}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {/* <Localized id="moderate-user-drawer-notes-field"> */}
                <Field id="reportHistory-note" name="note" validate={required}>
                  {({ input }) => (
                    <Textarea placeholder="Add your note..." {...input} />
                  )}
                </Field>
                {/* </Localized> */}
                <Flex justifyContent="flex-end">
                  {/* <Localized id="moderate-user-drawer-notes-button"> */}
                  {/* TODO Add icon here */}
                  <Button type="submit">Add update</Button>
                  {/* </Localized> */}
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
