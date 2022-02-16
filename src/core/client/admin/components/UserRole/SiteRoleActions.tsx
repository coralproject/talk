import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Form } from "react-final-form";
import { graphql } from "react-relay";

import useCommonTranslation, {
  COMMON_TRANSLATION,
} from "coral-admin/helpers/useCommonTranslation";
import { useToggleState } from "coral-framework/hooks";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  Button,
  ButtonIcon,
  CallOut,
  Card,
  CardCloseButton,
  ClickOutside,
  Dropdown,
  DropdownButton,
  Flex,
  HorizontalGutter,
  ListGroup,
  ListGroupRow,
  Modal,
  Popover,
  Typography,
} from "coral-ui/components/v2";

import { SiteRoleActions_user } from "coral-admin/__generated__/SiteRoleActions_user.graphql";
import { SiteRoleActions_viewer } from "coral-admin/__generated__/SiteRoleActions_viewer.graphql";

import ModalBodyText from "../ModalBodyText";
import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import DemoteUserMutation from "./DemoteUserMutation";
import PromoteUserMutation from "./PromoteUserMutation";
import SiteRoleActionsSites from "./SiteRoleActionsSites";
import UserRoleChangeButton from "./UserRoleChangeButton";
import UserRoleText from "./UserRoleText";

import styles from "./SiteRoleActions.css";

interface Props {
  viewer: SiteRoleActions_viewer;
  user: SiteRoleActions_user;
}

const SiteRoleActions: FunctionComponent<Props> = ({ viewer, user }) => {
  const promoteUser = useMutation(PromoteUserMutation);
  const demoteUser = useMutation(DemoteUserMutation);
  const notAvailableTranslation = useCommonTranslation(
    COMMON_TRANSLATION.NOT_AVAILABLE
  );

  const [mode, setMode] = useState<"promote" | "demote" | null>(null);
  const [isModalVisible, , toggleModalVisibility] = useToggleState();
  const [isPopoverVisible, , togglePopoverVisibility] = useToggleState();

  const onPromote = useCallback(() => {
    setMode("promote");
    togglePopoverVisibility();
    toggleModalVisibility();
  }, [toggleModalVisibility, togglePopoverVisibility]);

  const onDemote = useCallback(async () => {
    setMode("demote");
    togglePopoverVisibility();
    toggleModalVisibility();
  }, [toggleModalVisibility, togglePopoverVisibility]);

  const onCancel = useCallback(() => {
    setMode(null);
    toggleModalVisibility();
  }, [toggleModalVisibility]);

  const onSubmit = useCallback(
    async (input) => {
      try {
        if (mode === "promote") {
          await promoteUser({ userID: user.id, siteIDs: input.siteIDs });
        } else if (mode === "demote") {
          await demoteUser({ userID: user.id, siteIDs: input.siteIDs });
        }

        setMode(null);
        toggleModalVisibility();

        return;
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return { [FORM_ERROR]: err.message };
      }
    },
    [demoteUser, mode, promoteUser, toggleModalVisibility, user.id]
  );

  const viewerSites = viewer.moderationScopes?.sites || [];
  const userSites = user.moderationScopes?.sites || [];

  // These are sites that only the viewer has and the user does not.
  const uniqueViewerSites = viewerSites.filter(
    (s) => !userSites.find(({ id }) => s.id === id)
  );

  // These are sites that only the user has and the viewer does not.
  const uniqueUserSites = userSites.filter(
    (s) => !viewerSites.find(({ id }) => s.id === id)
  );

  // If the user is a site moderator and some of the sites on the user are the
  // same as the sites on the viewer, then we can demote this user.
  const canDemote =
    user.role === GQLUSER_ROLE.MODERATOR &&
    !!user.moderationScopes?.scoped &&
    userSites.some((s) => viewerSites.find(({ id }) => s.id === id));

  // If the user is a site moderator, staff, or commenter and some of the sites
  // on the viewer are not on the user, then we can promote this user.
  const canPromote =
    ((user.role === GQLUSER_ROLE.MODERATOR &&
      !!user.moderationScopes?.scoped) ||
      user.role === GQLUSER_ROLE.STAFF ||
      user.role === GQLUSER_ROLE.MEMBER ||
      user.role === GQLUSER_ROLE.COMMENTER) &&
    uniqueViewerSites.length > 0;

  const canPerformActions = canPromote || canDemote;

  if (!canPerformActions) {
    return (
      <UserRoleText
        moderationScopesEnabled
        scoped={!!user.moderationScopes?.scoped}
        role={user.role}
      />
    );
  }

  return (
    <>
      <Modal
        open={isModalVisible}
        onClose={onCancel}
        data-testid="SiteRoleActions-modal"
      >
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
                        <Localized id="community-SiteRolesArePermitted">
                          <ModalBodyText>
                            Site moderators are permitted to make moderation
                            decisions and issue suspensions on the sites they
                            are assigned.
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
                      <Localized id="community-SiteRoleModal-cancel">
                        <Button variant="flat" onClick={onCancel}>
                          Cancel
                        </Button>
                      </Localized>
                      {mode === "promote" ? (
                        <Localized id="community-SiteRoleModal-assign">
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
                        <Localized id="community-SiteRoleModal-remove">
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
      <Localized
        id="community-SiteRoleActions-popover"
        attrs={{ description: true }}
      >
        <Popover
          id="community-SiteRoleActions"
          placement="bottom-start"
          description="A dropdown to promote/demote a user to/from sites"
          visible={isPopoverVisible}
          body={
            <ClickOutside onClickOutside={togglePopoverVisibility}>
              <Dropdown>
                {canPromote &&
                  (user.role === GQLUSER_ROLE.MODERATOR ? (
                    <Localized id="community-assignMySites">
                      <DropdownButton onClick={onPromote}>
                        Assign my sites
                      </DropdownButton>
                    </Localized>
                  ) : (
                    <UserRoleChangeButton
                      role={GQLUSER_ROLE.MODERATOR}
                      scoped
                      moderationScopesEnabled
                      onClick={onPromote}
                    />
                  ))}
                {canDemote && (
                  <Localized id="community-removeMySites">
                    <DropdownButton onClick={onDemote}>
                      Remove my sites
                    </DropdownButton>
                  </Localized>
                )}
              </Dropdown>
            </ClickOutside>
          }
        >
          {({ ref }) => (
            <Localized
              id="community-changeRoleButton"
              attrs={{ "aria-label": true }}
            >
              <Button
                aria-label="Change role"
                className={styles.button}
                onClick={togglePopoverVisibility}
                uppercase={false}
                size="large"
                color="mono"
                ref={ref}
                variant="text"
              >
                <UserRoleText
                  moderationScopesEnabled
                  scoped={!!user.moderationScopes?.scoped}
                  role={user.role}
                />
                <ButtonIcon size="lg">
                  {isPopoverVisible ? "arrow_drop_up" : "arrow_drop_down"}
                </ButtonIcon>
              </Button>
            </Localized>
          )}
        </Popover>
      </Localized>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment SiteRoleActions_viewer on User {
      id
      moderationScopes {
        sites {
          id
          name
        }
      }
    }
  `,
  user: graphql`
    fragment SiteRoleActions_user on User {
      id
      username
      role
      moderationScopes {
        scoped
        sites {
          id
          name
        }
      }
    }
  `,
})(SiteRoleActions);

export default enhanced;
