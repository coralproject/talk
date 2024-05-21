import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Environment, graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  createFetch,
  useFetch,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import {
  GQLDSAReportHistoryType,
  GQLDSAReportStatus,
} from "coral-framework/schema";
import { DrawerDownloadIcon, SvgIcon } from "coral-ui/components/icons";
import { Button } from "coral-ui/components/v2";

import { ReportShareButton_dsaReport } from "coral-admin/__generated__/ReportShareButton_dsaReport.graphql";

import styles from "./ReportShareButton.css";

import AddReportShareMutation from "./AddReportShareMutation";

interface Props {
  dsaReport: ReportShareButton_dsaReport;
  setShowChangeStatusModal: (
    changeType: Exclude<
      GQLDSAReportHistoryType,
      | GQLDSAReportHistoryType.STATUS_CHANGED
      | GQLDSAReportHistoryType.DECISION_MADE
    > | null
  ) => void;
  userID?: string;
}

const ReportShareButton: FunctionComponent<Props> = ({
  dsaReport,
  userID,
  setShowChangeStatusModal,
}) => {
  const { window } = useCoralContext();

  const addReportShare = useMutation(AddReportShareMutation);

  const ReportDownloadFetch = createFetch(
    "dsaReportDownload",
    async (
      environment: Environment,
      variables: { reportID: string },
      { rest }
    ) => {
      const result = rest.fetch<any>(
        `/dsaReport/reportDownload?reportID=${variables.reportID}`,
        {
          method: "GET",
        }
      );
      return result;
    }
  );

  const fetchDownload = useFetch(ReportDownloadFetch);

  const onShareButtonClick = useCallback(async () => {
    try {
      const response = await fetchDownload({ reportID: dsaReport.id });
      const element = window.document.createElement("a");
      const file = new Blob([response], { type: "application/zip" });
      element.href = URL.createObjectURL(file);
      element.download = `dsaReport-${dsaReport.referenceID}`;
      window.document.body.appendChild(element);
      element.click();

      // If still awaiting review, prompt user to update status to In review on download
      if (dsaReport.status === GQLDSAReportStatus.AWAITING_REVIEW) {
        setShowChangeStatusModal(GQLDSAReportHistoryType.SHARE);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    if (userID) {
      await addReportShare({ reportID: dsaReport.id, userID });
    }
  }, [
    dsaReport,
    window,
    addReportShare,
    userID,
    fetchDownload,
    setShowChangeStatusModal,
  ]);

  return (
    <Localized
      id="reports-singleReport-shareButton"
      elems={{ icon: <SvgIcon Icon={DrawerDownloadIcon} /> }}
    >
      <Button
        className={styles.shareButton}
        variant="outlined"
        color="regular"
        uppercase
        target="_blank"
        rel="noreferrer"
        onClick={onShareButtonClick}
        iconLeft
      >
        <SvgIcon Icon={DrawerDownloadIcon} />
        CSV
      </Button>
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  dsaReport: graphql`
    fragment ReportShareButton_dsaReport on DSAReport {
      id
      referenceID
      status
    }
  `,
})(ReportShareButton);

export default enhanced;
