import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import useCommonTranslation, {
  COMMON_TRANSLATION,
} from "coral-admin/helpers/useCommonTranslation";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { GQLUSER_ROLE, GQLUSER_ROLE_RL } from "coral-framework/schema";
import {
  Button,
  CallOut,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
} from "coral-ui/components/v2";

import ModalBodyText from "../ModalBodyText";
import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import SiteRoleModalSites from "./SiteRoleModalSites";

import styles from "./SiteRoleModal.css";

interface Props {
  username: string | null;
  roleToBeSet: GQLUSER_ROLE_RL | null;
  open: boolean;
  onCancel: () => void;
  onFinish: (siteIDs: string[]) => Promise<void>;
  selectedSiteIDs?: string[];
}

const SiteRoleModal: FunctionComponent<Props> = ({
  username,
  roleToBeSet,
  open,
  onFinish,
  onCancel,
  selectedSiteIDs = [],
}) => {
  const notAvailableTranslation = useCommonTranslation(
    COMMON_TRANSLATION.NOT_AVAILABLE
  );
  const onSubmit = useCallback(
    async (values: { siteIDs: string[] }) => {
      try {
        await onFinish(values.siteIDs);
        return;
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return { [FORM_ERROR]: err.message };
      }
    },
    [onFinish]
  );

  return (
    <Modal
      open={open}
      onClose={onCancel}
      disableScroll
      data-testid="site-role-modal"
    >
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card
          className={styles.root}
          aria-label="A modal for managing the scope of a site scoped role"
        >
          <Flex justifyContent="flex-end">
            <CardCloseButton onClick={onCancel} ref={firstFocusableRef} />
          </Flex>
          <Form
            onSubmit={onSubmit}
            initialValues={{ siteIDs: selectedSiteIDs }}
          >
            {({ handleSubmit, submitError, submitting, values }) => {
              return (
                <form aria-label="form" onSubmit={handleSubmit}>
                  <HorizontalGutter spacing={3}>
                    <Localized
                      id="community-siteRoleModal-assignSites"
                      elems={{ strong: <ModalHeaderUsername /> }}
                      vars={{ username: username || notAvailableTranslation }}
                    >
                      <ModalHeader>
                        Assign sites for{" "}
                        <ModalHeaderUsername>{username}</ModalHeaderUsername>
                      </ModalHeader>
                    </Localized>
                    {submitError && (
                      <CallOut color="error" fullWidth>
                        {submitError}
                      </CallOut>
                    )}
                    {roleToBeSet === GQLUSER_ROLE.MODERATOR && (
                      <Localized id="community-siteRoleModal-assignSitesDescription-siteModerator">
                        <ModalBodyText>
                          Site moderators are permitted to make moderation
                          decisions and issue suspensions on the sites they are
                          assigned.
                        </ModalBodyText>
                      </Localized>
                    )}
                    {roleToBeSet === GQLUSER_ROLE.MEMBER && (
                      <Localized id="community-membersArePermitted">
                        <ModalBodyText>
                          Members are permitted to receive a badge on the sites
                          they are assigned.
                        </ModalBodyText>
                      </Localized>
                    )}
                    <SiteRoleModalSites
                      selectedSiteIDs={selectedSiteIDs}
                      roleToBeSet={roleToBeSet}
                    />
                    <Flex justifyContent="flex-end" itemGutter="half">
                      <Localized id="community-siteRoleModal-cancel">
                        <Button variant="flat" onClick={onCancel}>
                          Cancel
                        </Button>
                      </Localized>
                      <Localized id="community-siteRoleModal-update">
                        <Button
                          type="submit"
                          disabled={submitting || values.siteIDs.length === 0}
                          ref={lastFocusableRef}
                          data-testid="site-role-modal-submitButton"
                        >
                          Update
                        </Button>
                      </Localized>
                    </Flex>
                  </HorizontalGutter>
                </form>
              );
            }}
          </Form>
        </Card>
      )}
    </Modal>
  );
};

export default SiteRoleModal;
