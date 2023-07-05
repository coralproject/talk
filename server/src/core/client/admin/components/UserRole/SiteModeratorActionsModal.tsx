import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";

import useCommonTranslation, {
  COMMON_TRANSLATION,
} from "coral-admin/helpers/useCommonTranslation";
import { isOrgModerator } from "coral-common/permissions/types";
import {
  Button,
  CallOut,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  ListGroup,
  ListGroupRow,
  Modal,
  Typography,
} from "coral-ui/components/v2";

import ModalBodyText from "../ModalBodyText";
import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import SiteRoleActionsSites from "./SiteRoleActionsSites";

import { SiteRoleActions_user as User } from "coral-admin/__generated__/SiteRoleActions_user.graphql";
import { SiteRoleActions_viewer as Viewer } from "coral-admin/__generated__/SiteRoleActions_viewer.graphql";

import styles from "./SiteModeratorActionsModal.css";

export interface Props {
  open?: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  username: string | null;
  siteRoleScopes: User["membershipScopes"] | User["moderationScopes"];
  viewer: Viewer;
}

const SiteModeratorActionsModal: FunctionComponent<Props> = ({
  open,
  onCancel,
  onSubmit,
  username,
  siteRoleScopes,
  viewer,
}) => {
  const notAvailableTranslation = useCommonTranslation(
    COMMON_TRANSLATION.NOT_AVAILABLE
  );

  const userSites = siteRoleScopes?.sites || [];
  const viewerSites = isOrgModerator(viewer)
    ? userSites
    : viewer.moderationScopes?.sites || [];
  const viewerIsOrgMod = isOrgModerator(viewer);

  // These are sites that only the user has and the viewer does not.
  const uniqueUserSites = userSites.filter(
    (s) => !viewerSites.find(({ id }) => s.id === id)
  );

  return (
    <Modal
      open={!!open}
      onClose={onCancel}
      data-testid="siteModeratorActions-modal"
    >
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.modal}>
          <Flex justifyContent="flex-end">
            <CardCloseButton onClick={onCancel} ref={firstFocusableRef} />
          </Flex>
          <Form
            onSubmit={onSubmit}
            initialValues={{
              scopeAdditions: [],
              scopeDeletions: [],
            }}
          >
            {({ handleSubmit, submitError, submitting, values }) => (
              <form onSubmit={handleSubmit}>
                <HorizontalGutter spacing={3}>
                  <Localized
                    id="community-assignYourSitesTo"
                    elems={{ strong: <ModalHeaderUsername /> }}
                    vars={{ username: username || notAvailableTranslation }}
                  >
                    <ModalHeader>
                      Manage site permissions for{" "}
                      <ModalHeaderUsername>{username}</ModalHeaderUsername>
                    </ModalHeader>
                  </Localized>
                  {submitError && (
                    <CallOut color="error" fullWidth>
                      {submitError}
                    </CallOut>
                  )}
                  <Localized id="community-siteModeratorsArePermitted">
                    <ModalBodyText>
                      Site moderators are permitted to make moderation decisions
                      and issue suspensions on the sites they are assigned.
                    </ModalBodyText>
                  </Localized>
                  <ModalBodyText>
                    <Localized id="community-assignThisUser">
                      <Typography variant="bodyCopyBold">
                        Assign this user to
                      </Typography>
                    </Localized>
                  </ModalBodyText>
                  <SiteRoleActionsSites
                    viewerSites={viewerSites}
                    userSites={userSites}
                  />
                  {!viewerIsOrgMod && uniqueUserSites.length > 0 && (
                    <>
                      <Localized id="community-stillHaveSiteModeratorPrivileges">
                        <ModalBodyText>
                          They will still have privileges for:
                        </ModalBodyText>
                      </Localized>
                      <ListGroup>
                        {uniqueUserSites.map((site) => (
                          <ListGroupRow key={site.id}>
                            <Typography>{site.name}</Typography>
                          </ListGroupRow>
                        ))}
                      </ListGroup>
                    </>
                  )}
                  <Flex justifyContent="flex-end" itemGutter="half">
                    <Localized id="community-siteRoleModal-cancel">
                      <Button variant="flat" onClick={onCancel}>
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="community-siteRoleModal-update">
                      <Button
                        type="submit"
                        disabled={
                          submitting ||
                          (!values.scopeAdditions?.length &&
                            !values.scopeDeletions?.length)
                        }
                        ref={lastFocusableRef}
                      >
                        Update
                      </Button>
                    </Localized>
                  </Flex>
                </HorizontalGutter>
              </form>
            )}
          </Form>
        </Card>
      )}
    </Modal>
  );
};

export default SiteModeratorActionsModal;
