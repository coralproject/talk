import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Form } from "react-final-form";

import NotAvailable from "coral-admin/components/NotAvailable";

import { GetMessage, withGetMessage } from "coral-framework/lib/i18n";
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
  getMessage: GetMessage;

  moderationScopesEnabled?: boolean | null;
  viewerScopes: Scopes;
}

const BanModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  getMessage,
  moderationScopesEnabled,
  viewerScopes,
  userBanStatus,
}) => {
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

  const isSiteMod =
    !!moderationScopesEnabled &&
    viewerScopes.role === GQLUSER_ROLE.MODERATOR &&
    !!viewerScopes.sites &&
    viewerScopes.sites?.length > 0;

  const viewerIsSingleSiteMod = !!(
    isSiteMod &&
    viewerScopes.sites &&
    viewerScopes.sites.length === 1
  );

  const viewerIsAdmin = viewerScopes.role === GQLUSER_ROLE.ADMIN;
  const viewerIsOrgAdmin =
    viewerScopes.role === GQLUSER_ROLE.MODERATOR &&
    !!(!viewerScopes.sites || viewerScopes.sites?.length === 0);

  const [updateType, setUpdateType] = useState<UpdateType>(
    userBanStatus?.active ? UpdateType.NO_SITES : UpdateType.ALL_SITES
  );

  const [customizeMessage, setCustomizeMessage] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string>(getDefaultMessage);
  const [rejectComments, setRejectComments] = useState(false);

  const [banSiteIDs, setBanSiteIDs] = useState<string[]>([]);
  const [unbanSiteIDs, setUnbanSiteIDs] = useState<string[]>([]);

  const onFormSubmit = useCallback(
    (input) => {
      try {
        onConfirm(
          updateType,
          rejectComments,
          banSiteIDs,
          unbanSiteIDs,
          customizeMessage ? emailMessage : getDefaultMessage
        );

        return;
      } catch (err) {
        return { [FORM_ERROR]: err.message };
      }
    },
    [
      onConfirm,
      updateType,
      banSiteIDs,
      unbanSiteIDs,
      emailMessage,
      customizeMessage,
      getDefaultMessage,
      rejectComments,
    ]
  );

  const {
    title,
    titleLocalizationId,
    consequence,
    consequenceLocalizationId,
  } = getTextForUpdateType(updateType);

  const pendingSiteBanUpdates = banSiteIDs.length + unbanSiteIDs.length > 0;

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
          <Form
            onSubmit={onFormSubmit}
            initialValues={{
              showMessage: false,
              rejectExistingComments: false,
              emailMessage: getDefaultMessage,
              selectedIDs: [],
            }}
          >
            {({ handleSubmit, submitError }) => (
              <form onSubmit={handleSubmit}>
                <HorizontalGutter spacing={3}>
                  {!isSiteMod && updateType !== UpdateType.NO_SITES && (
                    <Localized id="community-banModal-reject-existing">
                      <CheckBox
                        id="banModal-rejectExisting"
                        checked={rejectComments}
                        onChange={(event) =>
                          setRejectComments(event.target.checked)
                        }
                      >
                        Reject all comments by this user
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
                      <FormField>
                        <Localized id="community-banModal-allSites">
                          <RadioButton
                            checked={updateType === UpdateType.ALL_SITES}
                            onChange={() => setUpdateType(UpdateType.ALL_SITES)}
                            disabled={userBanStatus?.active}
                          >
                            All sites
                          </RadioButton>
                        </Localized>
                      </FormField>
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
                      {!viewerIsScoped && (
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

                  {!!moderationScopesEnabled &&
                    updateType === UpdateType.SPECIFIC_SITES && (
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
                        disabled={
                          updateType === UpdateType.SPECIFIC_SITES &&
                          !pendingSiteBanUpdates
                        }
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

const enhanced = withGetMessage(BanModal);

export default enhanced;
