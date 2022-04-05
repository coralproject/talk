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

import { useGetMessage } from "coral-framework/lib/i18n";
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

import { UserStatusChangeContainer_user } from "coral-admin/__generated__/UserStatusChangeContainer_user.graphql";

import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import ChangeStatusModal from "./ChangeStatusModal";
import UserStatusSitesList, { Scopes } from "./UserStatusSitesList";

import { getTextForUpdateType } from "./helpers";

import styles from "./BanModal.css";

export enum UpdateType {
  ALL_SITES = "ALL_SITES",
  SPECIFIC_SITES = "SPECIFIC_SITES",
  NO_SITES = "NO_SITES",
}

interface Props {
  username: string | null;
  userBanStatus?: UserStatusChangeContainer_user["status"]["ban"];
  open: boolean;
  onClose: () => void;
  onConfirm: (
    updateType: UpdateType,
    rejectExistingComments: boolean,
    banSiteIDs?: string[] | null | undefined,
    unbanSiteIDs?: string[] | null | undefined,
    message?: string
  ) => void;
  moderationScopesEnabled?: boolean | null;
  viewerScopes: Scopes;
  userRole: string;
}

const BanModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  moderationScopesEnabled,
  viewerScopes,
  userBanStatus,
  userRole,
}) => {
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
    !!moderationScopesEnabled &&
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
  const [rejectComments, setRejectComments] = useState(false);

  const [banSiteIDs, setBanSiteIDs] = useState<string[]>([]);
  const [unbanSiteIDs, setUnbanSiteIDs] = useState<string[]>([]);

  useEffect(() => {
    if (viewerIsSingleSiteMod) {
      setBanSiteIDs(viewerScopes.sites!.map((scopeSite) => scopeSite.id));
    }
  }, [viewerIsSingleSiteMod]);

  const onFormSubmit = useCallback(() => {
    return onConfirm(
      updateType,
      rejectComments,
      banSiteIDs,
      unbanSiteIDs,
      customizeMessage ? emailMessage : getDefaultMessage
    );
  }, [
    onConfirm,
    updateType,
    banSiteIDs,
    unbanSiteIDs,
    emailMessage,
    customizeMessage,
    getDefaultMessage,
    rejectComments,
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
              strong={<ModalHeaderUsername />}
              username={React.createElement(() => (
                <strong>{username || <NotAvailable />}</strong>
              ))}
            >
              <ModalHeader id="banModal-title">
                {title + " "}
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
                        checked={rejectComments}
                        onChange={(event) =>
                          setRejectComments(event.target.checked)
                        }
                      >
                        {viewerIsSingleSiteMod
                          ? "Reject all comments on this site"
                          : rejectExistingCommentsMessage}
                      </CheckBox>
                    </Localized>
                  )}
                  {updateType !== UpdateType.NO_SITES && (
                    <Localized id="community-banModal-customize">
                      <CheckBox
                        id="banModal-showMessage"
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
                    (viewerIsScoped && !viewerIsSingleSiteMod)) && (
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
                    (!!moderationScopesEnabled &&
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
                    <Localized id="community-banModal-updateBan">
                      <Button
                        type="submit"
                        ref={lastFocusableRef}
                        disabled={disableForm}
                      >
                        Save
                      </Button>
                    </Localized>
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
