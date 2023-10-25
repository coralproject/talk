import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { Button } from "coral-ui/components/v2";

import { ReportShareButton_dsaReport } from "coral-admin/__generated__/ReportShareButton_dsaReport.graphql";

import styles from "./ReportShareButton.css";

import AddReportShareMutation from "./AddReportShareMutation";

interface Props {
  dsaReport: ReportShareButton_dsaReport;
  userID?: string;
  formatter: (date: string | number | Date) => string;
}

const ReportShareButton: FunctionComponent<Props> = ({
  dsaReport,
  userID,
  formatter,
}) => {
  const { window } = useCoralContext();

  const addReportShare = useMutation(AddReportShareMutation);

  const onShareButtonClick = useCallback(async () => {
    if (userID) {
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

      await addReportShare({ reportID: dsaReport.id, userID });
    }
  }, [dsaReport, window, addReportShare, formatter, userID]);

  return (
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
        Download
      </Button>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  dsaReport: graphql`
    fragment ReportShareButton_dsaReport on DSAReport {
      id
      createdAt
      referenceID
      reporter {
        username
      }
      additionalInformation
      lawBrokenDescription
    }
  `,
})(ReportShareButton);

export default enhanced;
