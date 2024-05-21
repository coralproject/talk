import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { Form } from "react-final-form";

import ModalHeader from "coral-admin/components/ModalHeader";
import { useMutation } from "coral-framework/lib/relay";
import {
  GQLDSAReportHistoryType,
  GQLDSAReportStatus,
} from "coral-framework/schema";
import {
  Button,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
} from "coral-ui/components/v2";

import ChangeReportStatusMutation from "./ChangeReportStatusMutation";

interface Props {
  reportID: string;
  userID?: string;
  showChangeStatusModal: Exclude<
    GQLDSAReportHistoryType,
    | GQLDSAReportHistoryType.STATUS_CHANGED
    | GQLDSAReportHistoryType.DECISION_MADE
  > | null;
  setShowChangeStatusModal: (
    changeType: Exclude<
      GQLDSAReportHistoryType,
      | GQLDSAReportHistoryType.STATUS_CHANGED
      | GQLDSAReportHistoryType.DECISION_MADE
    > | null
  ) => void;
}

const ChangeStatusModal: FunctionComponent<Props> = ({
  reportID,
  userID,
  showChangeStatusModal,
  setShowChangeStatusModal,
}) => {
  const changeReportStatus = useMutation(ChangeReportStatusMutation);

  const onCloseChangeStatusModal = useCallback(() => {
    setShowChangeStatusModal(null);
  }, [setShowChangeStatusModal]);

  const onSubmitStatusUpdate = useCallback(async () => {
    if (userID) {
      await changeReportStatus({
        userID,
        reportID,
        status: GQLDSAReportStatus.UNDER_REVIEW,
      });
      setShowChangeStatusModal(null);
    }
  }, [userID, reportID, setShowChangeStatusModal, changeReportStatus]);

  const actionText = useMemo(() => {
    if (!showChangeStatusModal) {
      return null;
    }
    const mapping = {
      NOTE: {
        text: "You have added a note. Would you like to update your status to In review.",
        id: "reports-changeStatusModal-prompt-addNote",
      },
      SHARE: {
        text: "You have downloaded the report. Would you like to update your status to In review.",
        id: "reports-changeStatusModal-prompt-downloadReport",
      },
    };
    return mapping[showChangeStatusModal];
  }, [showChangeStatusModal]);

  return (
    <Modal open={!!showChangeStatusModal}>
      {({ firstFocusableRef }) => (
        <Card>
          <Flex justifyContent="flex-end">
            <CardCloseButton
              onClick={onCloseChangeStatusModal}
              ref={firstFocusableRef}
            />
          </Flex>
          <Localized id="reports-changeStatusModal-header">
            <ModalHeader>Update status?</ModalHeader>
          </Localized>
          <Form onSubmit={onSubmitStatusUpdate}>
            {({ handleSubmit, hasValidationErrors }) => (
              <form onSubmit={handleSubmit}>
                <Flex direction="column" paddingTop={2} paddingBottom={2}>
                  <HorizontalGutter>
                    {actionText && (
                      <Localized id={actionText.id}>
                        <div>{actionText.text}</div>
                      </Localized>
                    )}
                    <Flex justifyContent="flex-end">
                      <Flex>
                        <Localized id="reports-changeStatusModal-dontUpdateButton">
                          <Button
                            color="mono"
                            variant="outlined"
                            onClick={onCloseChangeStatusModal}
                          >
                            No
                          </Button>
                        </Localized>
                      </Flex>
                      <Flex marginLeft={2}>
                        <Localized id="reports-changeStatusModal-updateButton">
                          <Button
                            type="submit"
                            iconLeft
                            disabled={hasValidationErrors}
                          >
                            Yes, update
                          </Button>
                        </Localized>
                      </Flex>
                    </Flex>
                  </HorizontalGutter>
                </Flex>
              </form>
            )}
          </Form>
        </Card>
      )}
    </Modal>
  );
};

export default ChangeStatusModal;
