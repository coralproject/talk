import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";
import { graphql } from "relay-runtime";

import useCommonTranslation, {
  COMMON_TRANSLATION,
} from "coral-admin/helpers/useCommonTranslation";
import { withFragmentContainer } from "coral-framework/lib/relay";
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
import SiteRoleActionsSites from "./SiteRoleActionsSites"; // TODO (marcushaddon): rename

import { SiteRoleActionsModal_user as User } from "coral-admin/__generated__/SiteRoleActionsModal_user.graphql";
import { SiteRoleActionsModal_viewer as Viewer } from "coral-admin/__generated__/SiteRoleActionsModal_viewer.graphql";

import styles from "./SiteRoleActionsModal.css";

export interface Props {
  open?: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void; // TODO (marcushaddon): refactor
  mode: "promote" | "demote" | null;
  user: User;
  viewer: Viewer;
}

const SiteRoleActionsModal: FunctionComponent<Props> = ({
  open,
  onCancel,
  onSubmit,
  mode,
  user,
  viewer,
}) => {
  const notAvailableTranslation = useCommonTranslation(
    COMMON_TRANSLATION.NOT_AVAILABLE
  );

  const userSites = user.membershipScopes?.sites || [];
  const viewerSites = viewer.moderationScopes?.sites || [];

  // These are sites that only the user has and the viewer does not.
  const uniqueUserSites = userSites.filter(
    (s) => !viewerSites.find(({ id }) => s.id === id)
  );

  {
    /* TODO (marcushaddon): refactor translation */
  }
  return (
    <Modal open={!!open} onClose={onCancel} data-testid="siteRoleActions-modal">
      {/* TODO (marcushaddon): pull modal into own component that accepts confirm, cancel callbacks, CopyModel props */}
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.modal}>
          <Flex justifyContent="flex-end">
            <CardCloseButton onClick={onCancel} ref={firstFocusableRef} />
          </Flex>
          <Form onSubmit={onSubmit}>
            {({ handleSubmit, submitError, submitting, values }) => (
              <form onSubmit={handleSubmit}>
                <HorizontalGutter spacing={3}>
                  {mode === "promote" ? (
                    <Localized
                      id="community-assignYourSitesTo"
                      strong={<ModalHeaderUsername />}
                      $username={user.username || notAvailableTranslation}
                    >
                      <ModalHeader>
                        Assign your sites to{" "}
                        <ModalHeaderUsername>
                          {user.username}
                        </ModalHeaderUsername>
                      </ModalHeader>
                    </Localized>
                  ) : (
                    <Localized id="community-removeSiteRolePermissions">
                      <ModalHeader>
                        Remove Site Moderator permissions
                      </ModalHeader>
                    </Localized>
                  )}
                  {submitError && (
                    <CallOut color="error" fullWidth>
                      {submitError}
                    </CallOut>
                  )}
                  {mode === "promote" ? (
                    <>
                      <Localized id="community-siteModeratorsArePermitted">
                        <ModalBodyText>
                          Site moderators are permitted to make moderation
                          decisions and issue suspensions on the sites they are
                          assigned.
                        </ModalBodyText>
                      </Localized>
                      <ModalBodyText>
                        <Localized id="community-assignThisUser">
                          <Typography variant="bodyCopyBold">
                            Assign this user to
                          </Typography>
                        </Localized>
                      </ModalBodyText>
                    </>
                  ) : (
                    <Localized id="community-userNoLongerPermitted">
                      <ModalBodyText>
                        User will no longer be permitted to make moderation
                        decisions or assign suspensions on:
                      </ModalBodyText>
                    </Localized>
                  )}
                  <SiteRoleActionsSites
                    viewerSites={viewerSites}
                    userSites={userSites}
                    mode={mode}
                  />
                  {mode === "demote" && uniqueUserSites.length > 0 && (
                    <>
                      <Localized id="community-stillHaveSiteRolePrivileges">
                        <ModalBodyText>
                          They will still have Site Moderator privileges for:
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
                    {mode === "promote" ? (
                      <Localized id="community-siteRoleModal-assign">
                        <Button
                          type="submit"
                          disabled={
                            submitting ||
                            (values.siteIDs && values.siteIDs.length === 0)
                          }
                          ref={lastFocusableRef}
                        >
                          Assign
                        </Button>
                      </Localized>
                    ) : (
                      <Localized id="community-siteRoleModal-remove">
                        <Button
                          type="submit"
                          color="alert"
                          disabled={
                            submitting ||
                            (values.siteIDs && values.siteIDs.length === 0)
                          }
                          ref={lastFocusableRef}
                        >
                          Remove
                        </Button>
                      </Localized>
                    )}
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

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment SiteRoleActionsModal_viewer on User {
      id
      moderationScopes {
        scoped
        sites {
          id
          name
        }
      }
    }
  `,
  user: graphql`
    fragment SiteRoleActionsModal_user on User {
      id
      username
      membershipScopes {
        sites {
          id
          name
        }
      }
    }
  `,
})(SiteRoleActionsModal);

export default enhanced;
