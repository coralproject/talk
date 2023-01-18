import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Form } from "react-final-form";

import NotAvailable from "coral-admin/components/NotAvailable";
import { extractDomain } from "coral-common/email";
import { useGetMessage } from "coral-framework/lib/i18n";
import { useMutation } from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  Button,
  CheckBox,
  Flex,
  FormField,
  HorizontalGutter,
  RadioButton,
  Textarea,
} from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { UserStatusChangeContainer_settings } from "coral-admin/__generated__/UserStatusChangeContainer_settings.graphql";
import { UserStatusChangeContainer_user } from "coral-admin/__generated__/UserStatusChangeContainer_user.graphql";

import BanDomainMutation from "./BanDomainMutation";
import BanUserMutation from "./BanUserMutation";
import ModalHeader from "./ModalHeader";
import ModalHeaderUsername from "./ModalHeaderUsername";
import RemoveUserBanMutation from "./RemoveUserBanMutation";
import UpdateUserBanMutation from "./UpdateUserBanMutation";
import ChangeStatusModal from "./UserStatus/ChangeStatusModal";
import { getTextForUpdateType } from "./UserStatus/helpers";
import UserStatusSitesList, { Scopes } from "./UserStatus/UserStatusSitesList";

import styles from "./BanModal.css";

export enum UpdateType {
  ALL_SITES = "ALL_SITES",
  SPECIFIC_SITES = "SPECIFIC_SITES",
  NO_SITES = "NO_SITES",
}

interface Props {
  userID: string;
  username: string | null;
  userEmail: string | null;
  userBanStatus?: UserStatusChangeContainer_user["status"]["ban"];
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  viewerScopes: Scopes;
  emailDomainModeration: UserStatusChangeContainer_settings["emailDomainModeration"];
  userRole: string;
  isMultisite: boolean;
}

interface BanButtonProps {
  isMultisite: boolean;
  isBanned: boolean;
  lastFocusableRef: React.RefObject<any>;
  disabled: boolean;
}

const BanButton: FunctionComponent<BanButtonProps> = ({
  isMultisite,
  isBanned,
  lastFocusableRef,
  disabled,
}) => {
  // When multisite, we return the humble Save button
  if (isMultisite) {
    return (
      <Localized id="community-banModal-updateBan">
        <Button type="submit" ref={lastFocusableRef} disabled={disabled}>
          Save
        </Button>
      </Localized>
    );
  }

  // Otherwise, we're doing a single-site ban flow, show appropriate
  // ban/unban accordingly
  if (isBanned) {
    return (
      <Localized id="community-banModal-unban">
        <Button type="submit" ref={lastFocusableRef} disabled={disabled}>
          Unban
        </Button>
      </Localized>
    );
  } else {
    return (
      <Localized id="community-banModal-ban">
        <Button
          type="submit"
          ref={lastFocusableRef}
          disabled={disabled}
          color="alert"
        >
          Ban
        </Button>
      </Localized>
    );
  }
};

const BanModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  userID,
  username,
  userEmail,
  viewerScopes,
  emailDomainModeration,
  userBanStatus,
  userRole,
  isMultisite,
}) => {
  const createDomainBan = useMutation(BanDomainMutation);
  const banUser = useMutation(BanUserMutation);
  const updateUserBan = useMutation(UpdateUserBanMutation);
  const removeUserBan = useMutation(RemoveUserBanMutation);

  const getMessage = useGetMessage();
  const getDefaultMessage = useMemo((): string => {
    return getMessage(
      "common-banEmailTemplate",
      "Someone with access to your account has violated our community guidelines. As a result, your account has been banned. You will no longer be able to comment, react or report comments",
      {
        username,
      }
    );
  }, [getMessage, username]);

  const viewerIsScoped = !!viewerScopes.sites && viewerScopes.sites.length > 0;

  const viewerIsSiteMod =
    !!isMultisite &&
    viewerScopes.role === GQLUSER_ROLE.MODERATOR &&
    !!viewerScopes.sites &&
    viewerScopes.sites?.length > 0;

  const viewerIsSingleSiteMod = !!(
    viewerIsSiteMod &&
    viewerScopes.sites &&
    viewerScopes.sites.length === 1
  );

  const viewerIsAdmin = viewerScopes.role === GQLUSER_ROLE.ADMIN;
  const viewerIsOrgAdmin =
    viewerScopes.role === GQLUSER_ROLE.MODERATOR &&
    !!(!viewerScopes.sites || viewerScopes.sites?.length === 0);

  const userIsBlanketBanned = !!userBanStatus?.active;
  const userIsSingleSiteBanned = !!userBanStatus?.sites?.length;
  const userHasAnyBan = userIsBlanketBanned || userIsSingleSiteBanned;

  const [updateType, setUpdateType] = useState<UpdateType>(() => {
    if (userIsBlanketBanned) {
      return UpdateType.NO_SITES;
    }
    if (userIsSingleSiteBanned) {
      return UpdateType.SPECIFIC_SITES;
    }
    return userRole === GQLUSER_ROLE.MODERATOR
      ? UpdateType.SPECIFIC_SITES
      : UpdateType.ALL_SITES;
  });

  const [customizeMessage, setCustomizeMessage] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string>(getDefaultMessage);
  const [rejectExistingComments, setRejectExistingComments] = useState(false);
  const [banDomain, setBanDomain] = useState(false);

  const [banSiteIDs, setBanSiteIDs] = useState<string[]>([]);
  const [unbanSiteIDs, setUnbanSiteIDs] = useState<string[]>([]);

  const [emailDomain] = useState(userEmail ? extractDomain(userEmail) : null);
  const domainIsConfigured = emailDomainModeration.find(
    ({ domain }) => domain === emailDomain
  );

  useEffect(() => {
    if (viewerIsSingleSiteMod) {
      setBanSiteIDs(viewerScopes.sites!.map((scopeSite) => scopeSite.id));
    }
  }, [viewerIsSingleSiteMod, viewerScopes.sites]);

  const onFormSubmit = useCallback(async () => {
    switch (updateType) {
      case UpdateType.ALL_SITES:
        await banUser({
          userID, // Should be defined because the modal shouldn't open if author is null
          message: customizeMessage ? emailMessage : getDefaultMessage,
          rejectExistingComments,
          siteIDs: viewerIsScoped
            ? viewerScopes.sites!.map(({ id }) => id)
            : [],
        });
        break;
      case UpdateType.SPECIFIC_SITES:
        await updateUserBan({
          userID,
          message: customizeMessage ? emailMessage : getDefaultMessage,
          banSiteIDs,
          unbanSiteIDs,
        });
        break;
      case UpdateType.NO_SITES:
        await removeUserBan({
          userID,
        });
    }
    if (banDomain) {
      void createDomainBan({
        domain: emailDomain!, // banDomain == true -> emailDomin != null
      });
    }
    return onConfirm();
  }, [
    updateType,
    banDomain,
    onConfirm,
    banUser,
    userID,
    customizeMessage,
    emailMessage,
    getDefaultMessage,
    rejectExistingComments,
    viewerIsScoped,
    viewerScopes.sites,
    updateUserBan,
    banSiteIDs,
    unbanSiteIDs,
    removeUserBan,
    createDomainBan,
    emailDomain,
  ]);

  const {
    title,
    titleLocalizationId,
    consequence,
    consequenceLocalizationId,
    rejectExistingCommentsLocalizationId,
    rejectExistingCommentsMessage,
  } = getTextForUpdateType(updateType);

  const pendingSiteBanUpdates = banSiteIDs.length + unbanSiteIDs.length > 0;
  const requiresSiteBanUpdates =
    updateType === UpdateType.SPECIFIC_SITES ||
    (updateType === UpdateType.ALL_SITES && viewerIsSingleSiteMod);
  const disableForm = requiresSiteBanUpdates && !pendingSiteBanUpdates;

  return (
    <ChangeStatusModal
      open={open}
      onClose={onClose}
      aria-labelledby="banModal-title"
    >
      {({ lastFocusableRef }) => (
        <HorizontalGutter spacing={3}>
          <HorizontalGutter spacing={2}>
            <Localized
              id={titleLocalizationId}
              elems={{
                strong: <ModalHeaderUsername />,
                username: React.createElement(() => (
                  <strong>{username || <NotAvailable />}</strong>
                )),
              }}
            >
              <ModalHeader id="banModal-title">
                {`${title} `}
                <ModalHeaderUsername>
                  {username || <NotAvailable />}
                </ModalHeaderUsername>
                ?
              </ModalHeader>
            </Localized>
            <Localized id={consequenceLocalizationId}>
              <p className={styles.bodyText}>{consequence}</p>
            </Localized>
          </HorizontalGutter>
          <Form onSubmit={onFormSubmit}>
            {({ handleSubmit, submitError }) => (
              <form onSubmit={handleSubmit}>
                <HorizontalGutter spacing={3}>
                  {updateType !== UpdateType.NO_SITES && (
                    <Localized
                      id={
                        viewerIsSingleSiteMod
                          ? "community-banModal-reject-existing-singleSite"
                          : rejectExistingCommentsLocalizationId!
                      }
                    >
                      <CheckBox
                        id="banModal-rejectExisting"
                        checked={rejectExistingComments}
                        onChange={(event) =>
                          setRejectExistingComments(event.target.checked)
                        }
                      >
                        {viewerIsSingleSiteMod
                          ? "Reject all comments on this site"
                          : rejectExistingCommentsMessage}
                      </CheckBox>
                    </Localized>
                  )}
                  {updateType !== UpdateType.NO_SITES &&
                    emailDomain &&
                    !domainIsConfigured && (
                      <Localized
                        id="community-banModal-banEmailDomain"
                        vars={{ domain: emailDomain }}
                      >
                        <CheckBox
                          onChange={({ target }) => {
                            setBanDomain(target.checked);
                          }}
                        >
                          Ban all new accounts on <strong>{emailDomain}</strong>
                        </CheckBox>
                      </Localized>
                    )}
                  {updateType !== UpdateType.NO_SITES && (
                    <Localized id="community-banModal-customize">
                      <CheckBox
                        checked={customizeMessage}
                        onChange={(event) =>
                          setCustomizeMessage(event.target.checked)
                        }
                      >
                        Customize ban email message
                      </CheckBox>
                    </Localized>
                  )}
                  {updateType !== UpdateType.NO_SITES && customizeMessage && (
                    <Textarea
                      id="banModal-message"
                      className={styles.textArea}
                      fullwidth
                      value={emailMessage}
                      onChange={(event) => setEmailMessage(event.target.value)}
                    />
                  )}
                  {(viewerIsAdmin ||
                    viewerIsOrgAdmin ||
                    (viewerIsScoped && !viewerIsSingleSiteMod)) &&
                    isMultisite && (
                      <Flex className={styles.sitesToggle} spacing={5}>
                        {!(userRole === GQLUSER_ROLE.MODERATOR) && (
                          <FormField>
                            <Localized id="community-banModal-allSites">
                              <RadioButton
                                checked={updateType === UpdateType.ALL_SITES}
                                onChange={() =>
                                  setUpdateType(UpdateType.ALL_SITES)
                                }
                                disabled={userBanStatus?.active}
                              >
                                All sites
                              </RadioButton>
                            </Localized>
                          </FormField>
                        )}
                        <FormField>
                          <Localized id="community-banModal-specificSites">
                            <RadioButton
                              checked={updateType === UpdateType.SPECIFIC_SITES}
                              onChange={() =>
                                setUpdateType(UpdateType.SPECIFIC_SITES)
                              }
                            >
                              Specific Sites
                            </RadioButton>
                          </Localized>
                        </FormField>
                        {!viewerIsScoped && userHasAnyBan && (
                          <FormField>
                            <Localized id="community-banModal-noSites">
                              <RadioButton
                                checked={updateType === UpdateType.NO_SITES}
                                onChange={() =>
                                  setUpdateType(UpdateType.NO_SITES)
                                }
                              >
                                No Sites
                              </RadioButton>
                            </Localized>
                          </FormField>
                        )}
                      </Flex>
                    )}

                  {(viewerIsSingleSiteMod ||
                    (isMultisite &&
                      updateType === UpdateType.SPECIFIC_SITES)) && (
                    <UserStatusSitesList
                      userBanStatus={userBanStatus}
                      viewerScopes={viewerScopes}
                      banState={[banSiteIDs, setBanSiteIDs]}
                      unbanState={[unbanSiteIDs, setUnbanSiteIDs]}
                    />
                  )}

                  {submitError && (
                    <CallOut
                      color="error"
                      title={submitError}
                      titleWeight="semiBold"
                    />
                  )}

                  <Flex justifyContent="flex-end" itemGutter="half">
                    <Localized id="community-banModal-cancel">
                      <Button variant="flat" onClick={onClose}>
                        Cancel
                      </Button>
                    </Localized>
                    <BanButton
                      isMultisite={isMultisite}
                      isBanned={!!(userBanStatus && userBanStatus?.active)}
                      lastFocusableRef={lastFocusableRef}
                      disabled={disableForm}
                    />
                  </Flex>
                </HorizontalGutter>
              </form>
            )}
          </Form>
        </HorizontalGutter>
      )}
    </ChangeStatusModal>
  );
};

export default BanModal;
