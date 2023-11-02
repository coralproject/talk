import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import ModalHeader from "coral-admin/components/ModalHeader";
import { useMutation } from "coral-framework/lib/relay";
import { GQLDSAReportStatus } from "coral-framework/schema";
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
  showChangeStatusModal: boolean;
  setShowChangeStatusModal: (show: boolean) => void;
}

const ChangeStatusModal: FunctionComponent<Props> = ({
  reportID,
  userID,
  showChangeStatusModal,
  setShowChangeStatusModal,
}) => {
  const changeReportStatus = useMutation(ChangeReportStatusMutation);

  const onCloseChangeStatusModal = useCallback(() => {
    setShowChangeStatusModal(false);
  }, [setShowChangeStatusModal]);

  const onSubmitStatusUpdate = useCallback(async () => {
    if (userID) {
      await changeReportStatus({
        userID,
        reportID,
        status: GQLDSAReportStatus.UNDER_REVIEW,
      });
      setShowChangeStatusModal(false);
    }
  }, [userID, reportID, setShowChangeStatusModal, changeReportStatus]);

  return (
    <Modal open={showChangeStatusModal}>
      {({ firstFocusableRef }) => (
        <Card>
          <Flex justifyContent="flex-end">
            <CardCloseButton
              onClick={onCloseChangeStatusModal}
              ref={firstFocusableRef}
            />
          </Flex>
          <Localized id="reports-changeStatusModal-header">
            <ModalHeader>Update status</ModalHeader>
          </Localized>
          <Form onSubmit={onSubmitStatusUpdate}>
            {({ handleSubmit, hasValidationErrors }) => (
              <form onSubmit={handleSubmit}>
                <Flex direction="column" padding={2}>
                  <HorizontalGutter>
                    <Localized id="reports-changeStatusModal-prompt">
                      <div>
                        Would you also like to update the status to In review
                        since you've now taken an action on this report?
                      </div>
                    </Localized>
                    <Flex justifyContent="flex-end">
                      <Localized id="reports-changeStatusModal-updateButton">
                        <Button
                          type="submit"
                          iconLeft
                          disabled={hasValidationErrors}
                        >
                          Update status
                        </Button>
                      </Localized>
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
