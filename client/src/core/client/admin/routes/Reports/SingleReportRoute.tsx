import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import {
  CommentContent,
  InReplyTo,
  UsernameButton,
} from "coral-admin/components/Comment";
import { MediaContainer } from "coral-admin/components/MediaContainer";
import CommentAuthorContainer from "coral-admin/components/ModerateCard/CommentAuthorContainer";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { withRouteConfig } from "coral-framework/lib/router";
import { Flex, HorizontalGutter, Timestamp } from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import { SingleReportRouteQueryResponse } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./SingleReportRoute.css";

import NotFound from "../NotFound";

type Props = SingleReportRouteQueryResponse;

const SingleReportRoute: FunctionComponent<Props> = (props) => {
  const { dsaReport } = props;
  const comment = dsaReport?.comment;

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!dsaReport) {
    return <NotFound />;
  }

  const inReplyTo = comment && comment.parent && comment.parent.author;

  return (
    // TODO: Localize all the labels in here
    <div className={styles.root}>
      <Flex className={styles.header}>
        <Flex direction="column">
          <div className={styles.label}>Report ID</div>
          <div>{dsaReport.publicID}</div>
        </Flex>
      </Flex>
      <Flex>
        <Flex className={styles.reportMain}>
          <Flex className={styles.innerMain} direction="column">
            <HorizontalGutter spacing={5}>
              <Flex>
                <Flex direction="column">
                  <div className={styles.label}>Reporter</div>
                  <div>{dsaReport.reporter?.username}</div>
                </Flex>
                <Flex className={styles.reportDate} direction="column">
                  <div className={styles.label}>Report Date</div>
                  <div>{formatter(dsaReport.createdAt)}</div>
                </Flex>
              </Flex>
              <Flex>
                <Flex direction="column">
                  <div className={styles.label}>What law was broken?</div>
                  <div>{dsaReport.lawBrokenDescription}</div>
                </Flex>
              </Flex>
              <Flex>
                <Flex direction="column">
                  <div className={styles.label}>Explanation</div>
                  <div>{dsaReport.additionalInformation}</div>
                </Flex>
              </Flex>
              <Flex>
                {comment && (
                  <Flex direction="column">
                    <div className={styles.label}>Comment</div>

                    <Flex>
                      <div>
                        <div>
                          <Flex alignItems="center">
                            {comment.author?.username && (
                              <>
                                <UsernameButton
                                  username={comment.author?.username}
                                  // onClick={commentAuthorClick}
                                  onClick={() => {}}
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
                              // onUsernameClick={commentParentAuthorClick}
                              onUsernameClick={() => {}}
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
                                  {comment.story?.metadata.title ?? ""}
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
        <Flex className={styles.reportHistory}>
          <div>History</div>
        </Flex>
      </Flex>
    </div>
  );
};

const enhanced = withRouteConfig<Props, SingleReportRouteQueryResponse>({
  query: graphql`
    query SingleReportRouteQuery($reportID: ID!) {
      dsaReport(id: $reportID) {
        id
        publicID
        lawBrokenDescription
        additionalInformation
        createdAt
        status
        reporter {
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
              username
            }
          }
          createdAt
          editing {
            edited
          }
          author {
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
  cacheConfig: { force: true },
  render: function SingleReportRouteRender({ Component, data }) {
    if (Component && data) {
      return <Component {...data} />;
    }
    // TODO: Loading?
    return <></>;
  },
})(SingleReportRoute);

export default enhanced;
