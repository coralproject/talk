import { Localized } from "@fluent/react/compat";
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
import NotAvailable from "coral-admin/components/NotAvailable";
import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { createRouteConfig } from "coral-framework/lib/router";
import { required } from "coral-framework/lib/validation";
import { ArrowsLeftIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import {
  Button,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
  Option,
  SelectField,
  Spinner,
  Textarea,
  Timestamp,
} from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import { SingleReportRouteQueryResponse } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./SingleReportRoute.css";

import NotFound from "../NotFound";
import ReportHistory from "./ReportHistory";
import ReportShareButton from "./ReportShareButton";
import ReportStatusMenu from "./ReportStatusMenu";

type Props = SingleReportRouteQueryResponse;

const SingleReportRoute: FunctionComponent<Props> & {
  routeConfig: RouteProps;
} = ({ dsaReport, viewer }) => {
  const comment = dsaReport?.comment;

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

  const [showDecisionModal, setShowDecisionModal] = useState(false);

  const onSubmitDecision = useCallback(() => {
    // TODO
  }, []);
  const onCloseDecisionModal = useCallback(() => {
    setShowDecisionModal(false);
  }, [setShowDecisionModal]);

  if (!dsaReport) {
    return <NotFound />;
  }

  return (
    <div className={styles.root}>
      <Flex className={styles.reportsLink}>
        <Localized
          id="reports-singleReport-reportsLinkButton"
          elems={{ icon: <ButtonSvgIcon Icon={ArrowsLeftIcon} /> }}
        >
          <Button
            variant="text"
            to="/admin/reports"
            uppercase={false}
            iconLeft
            color="mono"
          >
            <ButtonSvgIcon Icon={ArrowsLeftIcon} />
            All DSA Reports
          </Button>
        </Localized>
      </Flex>
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
            value={dsaReport.status}
            reportID={dsaReport.id}
            userID={viewer?.id}
          />
          <ReportShareButton dsaReport={dsaReport} userID={viewer?.id} />
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
                            {/* TODO: Do we want to show message for deleted/rejected */}
                            <CommentContent className={styles.commentContent}>
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
                                  {comment.story?.metadata?.title ?? (
                                    <NotAvailable />
                                  )}
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
              <Modal open={showDecisionModal}>
                {({ firstFocusableRef }) => (
                  <Card>
                    <Flex justifyContent="flex-end">
                      <CardCloseButton
                        onClick={onCloseDecisionModal}
                        ref={firstFocusableRef}
                      />
                    </Flex>
                    {/* TODO: Localize all of this */}
                    <Form onSubmit={onSubmitDecision}>
                      {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                          <Flex direction="column">
                            <HorizontalGutter>
                              <Flex alignItems="center">
                                <div>This comment</div>
                                <Field id="reportDecision" name="decision">
                                  {({ input }) => {
                                    return (
                                      <SelectField {...input} id={input.name}>
                                        <Option value="ILLEGAL">
                                          contains illegal content
                                        </Option>
                                        <Option value="LEGAL">
                                          does not appear to contain illegal
                                          content
                                        </Option>
                                      </SelectField>
                                    );
                                  }}
                                </Field>
                              </Flex>
                              <Flex>
                                <Field
                                  id="reportLegalGrounds"
                                  name="legalGrounds"
                                  validate={required}
                                >
                                  {({ input }) => (
                                    <Textarea
                                      placeholder="Legal grounds"
                                      {...input}
                                    />
                                  )}
                                </Field>
                              </Flex>
                              <Flex>
                                <Field
                                  id="reportReason"
                                  name="reason"
                                  validate={required}
                                >
                                  {({ input }) => (
                                    <Textarea
                                      placeholder="Explanation"
                                      {...input}
                                    />
                                  )}
                                </Field>
                              </Flex>
                              <Flex justifyContent="flex-end">
                                <Button type="submit" iconLeft>
                                  Submit
                                </Button>
                              </Flex>
                            </HorizontalGutter>
                          </Flex>
                        </form>
                      )}
                    </Form>
                  </Card>
                )}
              </Modal>
            </HorizontalGutter>
          </Flex>
        </Flex>
        <ReportHistory dsaReport={dsaReport} userID={viewer?.id} />
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
          deleted
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

          ...CommentAuthorContainer_comment
          ...MediaContainer_comment
        }
        ...ReportHistory_dsaReport
        ...ReportShareButton_dsaReport
      }
    }
  `,
  Component: SingleReportRoute,
  cacheConfig: { force: true },
  render: function SingleReportRouteRender({ Component, data }) {
    if (Component && data) {
      return <Component {...data} />;
    }
    return <Spinner />;
  },
});

export default SingleReportRoute;
