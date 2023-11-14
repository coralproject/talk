import { Localized } from "@fluent/react/compat";
import { RouteProps } from "found";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql } from "react-relay";

import UserHistoryDrawer from "coral-admin/components/UserHistoryDrawer";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import { createRouteConfig } from "coral-framework/lib/router";
import {
  GQLDSAReportDecisionLegality,
  GQLDSAReportHistoryType,
} from "coral-framework/schema";
import {
  ArrowsLeftIcon,
  ButtonSvgIcon,
  LegalHammerIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import {
  Button,
  Divider,
  Flex,
  HorizontalGutter,
  Spinner,
} from "coral-ui/components/v2";

import { SingleReportRouteQueryResponse } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./SingleReportRoute.css";

import NotFound from "../NotFound";
import ChangeStatusModal from "./ChangeStatusModal";
import ReportedComment from "./ReportedComment";
import ReportHistory from "./ReportHistory";
import ReportMakeDecisionModal from "./ReportMakeDecisionModal";
import ReportShareButton from "./ReportShareButton";
import ReportStatusMenu from "./ReportStatusMenu";

type Props = SingleReportRouteQueryResponse;

const SingleReportRoute: FunctionComponent<Props> & {
  routeConfig: RouteProps;
} = ({ dsaReport, viewer }) => {
  const [showChangeStatusModal, setShowChangeStatusModal] = useState<Exclude<
    GQLDSAReportHistoryType,
    | GQLDSAReportHistoryType.STATUS_CHANGED
    | GQLDSAReportHistoryType.DECISION_MADE
  > | null>(null);

  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

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

  const onChangeReportStatusCompleted = useCallback(() => {
    setShowDecisionModal(true);
  }, [setShowDecisionModal]);

  const onClickMakeDecisionButton = useCallback(() => {
    setShowDecisionModal(true);
  }, [setShowDecisionModal]);

  const reportDecisionTimestamp = useMemo(() => {
    const decisionMadeHistory = dsaReport?.history?.filter(
      (h) => h?.type === GQLDSAReportHistoryType.DECISION_MADE
    );
    return decisionMadeHistory && decisionMadeHistory.length > 0
      ? decisionMadeHistory[0]!.createdAt
      : null;
  }, [dsaReport]);

  if (!dsaReport) {
    return <NotFound />;
  }

  return (
    <div className={styles.root} data-testid="single-report-route">
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
          <div className={styles.refID}>{dsaReport.referenceID}</div>
        </Flex>
        <Flex alignItems="center" className={styles.autoMarginLeft}>
          <ReportStatusMenu
            value={dsaReport.status}
            reportID={dsaReport.id}
            userID={viewer?.id}
            onChangeReportStatusCompleted={onChangeReportStatusCompleted}
          />
          <Localized
            id="reports-singleReport-makeDecisionButton"
            elems={{
              icon: <SvgIcon filled="currentColor" Icon={LegalHammerIcon} />,
            }}
          >
            <Button
              className={styles.decisionButton}
              iconLeft
              onClick={onClickMakeDecisionButton}
              disabled={
                dsaReport.status === "COMPLETED" || dsaReport.status === "VOID"
              }
            >
              <SvgIcon filled="currentColor" Icon={LegalHammerIcon} />
              Decision
            </Button>
          </Localized>
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
                      <div className={styles.data}>
                        Reporter name not available
                      </div>
                    </Localized>
                  )}
                </Flex>
                <Flex className={styles.autoMarginLeft} direction="column">
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
              <ReportedComment
                dsaReport={dsaReport}
                onShowUserDrawer={onShowUserDrawer}
              />
              {dsaReport.decision && (
                <>
                  <Divider />
                  <Flex
                    direction="column"
                    className={styles.decisionWrapper}
                    padding={2}
                  >
                    <HorizontalGutter spacing={3}>
                      <Flex>
                        <SvgIcon
                          className={styles.decisionIcon}
                          Icon={LegalHammerIcon}
                          filled="currentColor"
                        />
                        <Localized id="reports-singleReport-decisionLabel">
                          <div className={styles.label}>Decision</div>
                        </Localized>
                      </Flex>
                      <div>
                        <Localized id="reports-singleReport-decision-doesItContain">
                          <div className={styles.label}>
                            Does this comment contain illegal content?
                          </div>
                        </Localized>
                        {dsaReport.decision.legality ===
                        GQLDSAReportDecisionLegality.ILLEGAL ? (
                          <Localized id="reports-singleReport-decision-doesItContain-yes">
                            <div className={styles.data}>Yes</div>
                          </Localized>
                        ) : (
                          <Localized id="reports-singleReport-decision-doesItContain-no">
                            <div className={styles.data}>No</div>
                          </Localized>
                        )}
                      </div>
                      {dsaReport.decision.legality ===
                        GQLDSAReportDecisionLegality.ILLEGAL && (
                        <>
                          <Flex direction="column">
                            <Localized id="reports-singleReport-decision-legalGrounds">
                              <div className={styles.label}>Legal grounds</div>
                            </Localized>
                            <div className={styles.data}>
                              {`${dsaReport.decision.legalGrounds}`}
                            </div>
                          </Flex>
                          <Flex direction="column">
                            <Localized id="reports-singleReport-decision-explanation">
                              <div className={styles.label}>
                                Detailed explanation
                              </div>
                            </Localized>
                            <div className={styles.data}>
                              {`${dsaReport.decision.detailedExplanation}`}
                            </div>
                          </Flex>
                          {reportDecisionTimestamp && (
                            <Flex direction="column">
                              <div className={styles.label}>
                                {formatter(reportDecisionTimestamp)}
                              </div>
                            </Flex>
                          )}
                        </>
                      )}
                    </HorizontalGutter>
                  </Flex>
                </>
              )}
            </HorizontalGutter>
          </Flex>
        </Flex>
        <IntersectionProvider threshold={[0, 1]}>
          <ReportHistory
            dsaReport={dsaReport}
            userID={viewer?.id}
            setShowChangeStatusModal={setShowChangeStatusModal}
          />
        </IntersectionProvider>
      </Flex>
      <UserHistoryDrawer
        userID={userDrawerUserID}
        open={userDrawerVisible}
        onClose={onHideUserDrawer}
        setUserID={onSetUserID}
      />
      <ReportMakeDecisionModal
        userID={viewer?.id}
        dsaReport={dsaReport}
        setShowDecisionModal={setShowDecisionModal}
        showDecisionModal={showDecisionModal}
      />
      <ChangeStatusModal
        showChangeStatusModal={showChangeStatusModal}
        setShowChangeStatusModal={setShowChangeStatusModal}
        reportID={dsaReport.id}
        userID={viewer?.id}
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
        history {
          id
          createdAt
          type
          decision {
            legality
            legalGrounds
            detailedExplanation
          }
        }
        decision {
          legality
          legalGrounds
          detailedExplanation
        }
        comment {
          ...CommentAuthorContainer_comment
          ...MediaContainer_comment
        }
        ...ReportHistory_dsaReport
        ...ReportShareButton_dsaReport
        ...ReportMakeDecisionModal_dsaReport
        ...ReportedComment_dsaReport
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
