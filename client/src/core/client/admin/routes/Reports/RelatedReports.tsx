import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { ArrowRightIcon, SvgIcon } from "coral-ui/components/icons";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { RelatedReports_dsaReport } from "coral-admin/__generated__/RelatedReports_dsaReport.graphql";

import styles from "./RelatedReports.css";

interface Props {
  dsaReport: RelatedReports_dsaReport;
}

const RelatedReports: FunctionComponent<Props> = ({ dsaReport }) => {
  const relatedReports = dsaReport.relatedReports.edges.map(
    (edge) => edge.node
  );

  if (relatedReports.length === 0) {
    return null;
  }

  return (
    <Flex direction="column">
      <Localized id="reports-relatedReports-label">
        <div className={styles.label}>Related Reports</div>
      </Localized>
      {relatedReports.map((report) => {
        return (
          <Flex marginTop={2} key={report.id}>
            <Button
              className={styles.button}
              fullWidth
              color="none"
              variant="flat"
              href={`/admin/reports/report/${report.id}`}
            >
              <Flex>
                <Flex>
                  <Localized id="reports-relatedReports-reportIDLabel">
                    <span className={styles.reportIDLabel}>Report ID</span>
                  </Localized>
                  <span className={styles.referenceID}>
                    {report.referenceID}
                  </span>
                </Flex>
                <Flex className={styles.arrowIcon}>
                  <SvgIcon Icon={ArrowRightIcon} />
                </Flex>
              </Flex>
            </Button>
          </Flex>
        );
      })}
    </Flex>
  );
};

const enhanced = withFragmentContainer<Props>({
  dsaReport: graphql`
    fragment RelatedReports_dsaReport on DSAReport
    @argumentDefinitions(
      count: { type: "Int", defaultValue: 20 }
      cursor: { type: "Cursor" }
      orderBy: { type: "REPORT_SORT", defaultValue: CREATED_AT_DESC }
    ) {
      id
      relatedReports(first: $count, after: $cursor, orderBy: $orderBy)
        @connection(key: "RelatedReports_relatedReports") {
        edges {
          node {
            id
            referenceID
          }
        }
      }
    }
  `,
})(RelatedReports);

export default enhanced;
