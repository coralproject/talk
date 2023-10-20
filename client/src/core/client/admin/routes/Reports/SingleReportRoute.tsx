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
import { useMutation } from "coral-framework/lib/relay";
import { createRouteConfig } from "coral-framework/lib/router";
import { required } from "coral-framework/lib/validation";
import { GQLDSAReportHistoryType } from "coral-framework/schema";
import {
  Button,
  Flex,
  HorizontalGutter,
  Textarea,
  // SelectField,
  Timestamp,
} from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import { SingleReportRouteQueryResponse } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./SingleReportRoute.css";

import NotFound from "../NotFound";
import ReportStatusMenu from "./ReportStatusMenu";

import AddReportNoteMutation from "./AddReportNoteMutation";

type Props = SingleReportRouteQueryResponse;

const SingleReportRoute: FunctionComponent<Props> & {
  routeConfig: RouteProps;
} = (props) => {
  const { dsaReport, viewer } = props;
  const comment = dsaReport?.comment;

  const addReportNote = useMutation(AddReportNoteMutation);

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

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
          <ReportStatusMenu onChange={() => {}} />
          {/* TODO: Should download report when clicked */}
          <Button
            className={styles.shareButton}
            variant="outlined"
            color="regular"
            uppercase
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
          {dsaReport.history?.map((h) => {
            if (h?.type === GQLDSAReportHistoryType.NOTE) {
              return (
                <div key={h.id}>
                  {/* TODO: Localize */}
                  <div>{`${h.createdBy?.username} added a note`}</div>
                  <div>{h.body}</div>
                  {/* TODO: Add in ability to delete the note */}
                  <div>{h.createdAt}</div>
                </div>
              );
            }
            if (h?.type === GQLDSAReportHistoryType.STATUS_CHANGED) {
              // TODO: Make new status human-readable
              return (
                <div key={h.id}>
                  <div>{`${h.createdBy?.username} changed status to ${h.status}`}</div>
                  <div>{h.createdAt}</div>
                </div>
              );
            }
            return <div key={h.id}>history type not implemented yet</div>;
          })}
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
