import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import useCommonTranslation, {
  COMMON_TRANSLATION,
} from "coral-admin/helpers/useCommonTranslation";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";

import ModalBodyText from "../ModalBodyText";
import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import ChangeStatusModal from "./ChangeStatusModal";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PremodModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
}) => {
  const notAvailableTranslation = useCommonTranslation(
    COMMON_TRANSLATION.NOT_AVAILABLE
  );
  return (
    <ChangeStatusModal
      open={open}
      onClose={onClose}
      aria-labelledby="PremodModal-title"
    >
      {({ lastFocusableRef }) => (
        <HorizontalGutter spacing={3}>
          <Localized
            id="community-premodModal-areYouSure"
            elems={{ strong: <ModalHeaderUsername /> }}
            vars={{ username: username || notAvailableTranslation }}
          >
            <ModalHeader id="PremodModal-title">
              Are you sure you want to always premoderate{" "}
              <ModalHeaderUsername>
                {username || <NotAvailable />}
              </ModalHeaderUsername>
              ?
            </ModalHeader>
          </Localized>
          <Localized id="community-premodModal-consequence">
            <ModalBodyText>
              Note: Always premoderating this user will place all of their
              comments in the Pre-Moderate queue.
            </ModalBodyText>
          </Localized>
          <Flex justifyContent="flex-end" itemGutter>
            <Localized id="community-premodModal-cancel">
              <Button variant="flat" onClick={onClose}>
                Cancel
              </Button>
            </Localized>

            <Localized id="community-premodModal-premodUser">
              <Button onClick={onConfirm} ref={lastFocusableRef}>
                Yes, always premoderate user
              </Button>
            </Localized>
          </Flex>
        </HorizontalGutter>
      )}
    </ChangeStatusModal>
  );
};

export default PremodModal;
