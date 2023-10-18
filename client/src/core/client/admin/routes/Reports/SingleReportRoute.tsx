import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { withRouteConfig } from "coral-framework/lib/router";
import { Flex, HorizontalGutter } from "coral-ui/components/v2";

import { SingleReportRouteQueryResponse } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./SingleReportRoute.css";

import NotFound from "../NotFound";

type Props = SingleReportRouteQueryResponse;

const SingleReportRoute: FunctionComponent<Props> = (props) => {
  const { dsaReport } = props;

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
                <Flex direction="column">
                  <div className={styles.label}>Comment</div>
                  {/* TODO: Add in comment */}
                </Flex>
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
          author {
            username
          }
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
