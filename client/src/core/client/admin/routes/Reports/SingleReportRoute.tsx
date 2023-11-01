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
import ModalHeader from "coral-admin/components/ModalHeader";
import CommentAuthorContainer from "coral-admin/components/ModerateCard/CommentAuthorContainer";
import NotAvailable from "coral-admin/components/NotAvailable";
import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import {
  getModerationLink,
  getURLWithCommentID,
} from "coral-framework/helpers";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { useMutation } from "coral-framework/lib/relay";
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
  Spinner,
  Textarea,
  Timestamp,
} from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import { SingleReportRouteQueryResponse } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./SingleReportRoute.css";

import NotFound from "../NotFound";
import ChangeReportStatusMutation from "./ChangeReportStatusMutation";
import MakeReportDecisionMutation from "./MakeReportDecisionMutation";
import ReportHistory from "./ReportHistory";
import ReportShareButton from "./ReportShareButton";
import ReportStatusMenu from "./ReportStatusMenu";

type Props = SingleReportRouteQueryResponse;

const SingleReportRoute: FunctionComponent<Props> & {
  routeConfig: RouteProps;
} = ({ dsaReport, viewer }) => {
  const comment = dsaReport?.comment;

  const makeReportDecision = useMutation(MakeReportDecisionMutation);
  const changeReportStatus = useMutation(ChangeReportStatusMutation);

  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);

  const onCloseChangeStatusModal = useCallback(() => {
    setShowChangeStatusModal(false);
  }, [setShowChangeStatusModal]);

  const onSubmitStatusUpdate = useCallback(async () => {
    if (viewer?.id && dsaReport?.id) {
      await changeReportStatus({
        userID: viewer.id,
        reportID: dsaReport.id,
        status: "UNDER_REVIEW",
      });
      setShowChangeStatusModal(false);
    }
  }, [viewer, dsaReport, setShowChangeStatusModal, changeReportStatus]);

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

  const [makeDecisionSelection, setMakeDecisionSelection] = useState<
    null | string
  >(null);

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

  const onSubmitDecision = useCallback(
    async (input: any, form: FormApi) => {
      if (dsaReport && viewer?.id && dsaReport.comment?.revision) {
        try {
          await makeReportDecision({
            userID: viewer.id,
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
    [makeReportDecision, viewer, dsaReport, makeDecisionSelection]
  );
  const onCloseDecisionModal = useCallback(() => {
    setShowDecisionModal(false);
  }, [setShowDecisionModal]);

  const onChangeReportStatusCompleted = useCallback(() => {
    setShowDecisionModal(true);
  }, [setShowDecisionModal]);

  const onClickMakeDecisionButton = useCallback(() => {
    setShowDecisionModal(true);
  }, [setShowDecisionModal]);

  const onClickMakeDecisionContainsIllegal = useCallback(() => {
    setMakeDecisionSelection("YES");
  }, [setMakeDecisionSelection]);

  const onClickMakeDecisionDoesNotContainIllegal = useCallback(() => {
    setMakeDecisionSelection("NO");
  }, [setMakeDecisionSelection]);

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
        <Flex alignItems="center" className={styles.autoMarginLeft}>
          <ReportStatusMenu
            value={dsaReport.status}
            reportID={dsaReport.id}
            userID={viewer?.id}
            onChangeReportStatusCompleted={onChangeReportStatusCompleted}
          />
          <Button
            className={styles.decisionButton}
            onClick={onClickMakeDecisionButton}
            disabled={
              dsaReport.status === "COMPLETED" || dsaReport.status === "VOID"
            }
          >
            Make Decision
          </Button>
        </Flex>
        <Flex
          className={styles.autoMarginLeft}
          justifyContent="flex-end"
          alignItems="center"
        >
          <ReportShareButton
            dsaReport={dsaReport}
            userID={viewer?.id}
            setShowChangeStatusModal={setShowChangeStatusModal}
          />
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
              <Flex direction="column">
                {comment && (
                  <>
                    <Flex direction="column" className={styles.commentMain}>
                      <Localized id="reports-singleReport-comment">
                        <div className={styles.label}>Comment</div>
                      </Localized>
                      <>
                        {comment.deleted ? (
                          <div>
                            This comment is no longer available. The commenter
                            has deleted their account.
                          </div>
                        ) : (
                          <>
                            <Flex className={styles.commentBox}>
                              <div>
                                <div>
                                  <Flex alignItems="center">
                                    {comment.author?.username && (
                                      <>
                                        <UsernameButton
                                          className={
                                            styles.commentUsernameButton
                                          }
                                          username={comment.author.username}
                                          onClick={() =>
                                            onShowUserDrawer(comment.author?.id)
                                          }
                                        />
                                        <CommentAuthorContainer
                                          comment={comment}
                                        />
                                      </>
                                    )}
                                    <Timestamp>{comment.createdAt}</Timestamp>
                                    {comment.editing.edited && (
                                      <Localized id="reports-singleReport-comment-edited">
                                        <span className={styles.edited}>
                                          (edited)
                                        </span>
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
                                    <CommentContent
                                      className={styles.commentContent}
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
                            {/* TODO: Localize these comment links */}
                            <Flex marginTop={2}>
                              <Button
                                variant="text"
                                uppercase={false}
                                color="mono"
                                to={getURLWithCommentID(
                                  comment.story.url,
                                  comment.id
                                )}
                                target="_blank"
                              >
                                View comment in stream
                              </Button>
                            </Flex>
                            <Flex marginTop={2}>
                              <Button
                                variant="text"
                                uppercase={false}
                                color="mono"
                                target="_blank"
                                to={getModerationLink({
                                  commentID: comment.id,
                                })}
                              >
                                View comment in moderation
                              </Button>
                            </Flex>
                          </>
                        )}
                      </>
                    </Flex>
                  </>
                )}
              </Flex>
              {dsaReport.decision && (
                <Flex direction="column">
                  <HorizontalGutter spacing={2}>
                    {/* <Localized id="reports-singleReport-comment"> */}
                    <div className={styles.label}>Decision</div>
                    {/* </Localized> */}
                    {dsaReport.decision.legality === "ILLEGAL" ? (
                      <>
                        <Flex direction="column">
                          <div className={styles.data}>
                            This report appears to contain illegal content
                          </div>
                        </Flex>
                        <Flex direction="column">
                          <div className={styles.label}>Legal grounds</div>
                          <div className={styles.data}>
                            {`${dsaReport.decision.legalGrounds}`}
                          </div>
                        </Flex>
                        <Flex direction="column">
                          <div className={styles.label}>
                            Detailed explanation
                          </div>
                          <div className={styles.data}>
                            {`${dsaReport.decision.detailedExplanation}`}
                          </div>
                        </Flex>
                      </>
                    ) : (
                      <div className={styles.data}>
                        This report does not appear to contain illegal content
                      </div>
                    )}
                  </HorizontalGutter>
                </Flex>
              )}
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
                                <div
                                  className={styles.decisionModalThisComment}
                                >
                                  Does this comment appear to contain illegal
                                  content?
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
                                    onClick={
                                      onClickMakeDecisionDoesNotContainIllegal
                                    }
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
                                          className={
                                            styles.decisionModalTextArea
                                          }
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
                                          className={
                                            styles.decisionModalTextArea
                                          }
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
            </HorizontalGutter>
          </Flex>
        </Flex>
        <ReportHistory
          dsaReport={dsaReport}
          userID={viewer?.id}
          setShowChangeStatusModal={setShowChangeStatusModal}
        />
      </Flex>
      <UserHistoryDrawer
        userID={userDrawerUserID}
        open={userDrawerVisible}
        onClose={onHideUserDrawer}
        setUserID={onSetUserID}
      />
      <Modal open={showChangeStatusModal}>
        {({ firstFocusableRef }) => (
          <Card>
            <Flex justifyContent="flex-end">
              <CardCloseButton
                onClick={onCloseChangeStatusModal}
                ref={firstFocusableRef}
              />
            </Flex>
            <ModalHeader>Update status</ModalHeader>
            {/* TODO: Localize all of this */}
            <Form onSubmit={onSubmitStatusUpdate}>
              {({ handleSubmit, hasValidationErrors }) => (
                <form onSubmit={handleSubmit}>
                  <Flex direction="column" padding={2}>
                    <HorizontalGutter>
                      <div>
                        Would you also like to update the status to In review
                        since you've now taken an action on this report?
                      </div>
                      <Flex justifyContent="flex-end">
                        <Button
                          type="submit"
                          iconLeft
                          disabled={hasValidationErrors}
                        >
                          Update status
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
        decision {
          legality
          legalGrounds
          detailedExplanation
        }
        comment {
          id
          deleted
          body
          story {
            id
            url
            metadata {
              title
            }
          }
          revision {
            id
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
