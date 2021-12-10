import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { Field, Form } from "react-final-form";

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

  const onFormSubmit = useCallback(
    ({
      updateType,
      sendCustomMessage,
      customMessage,
      rejectExistingComments,
      banSiteIDs,
      unbanSiteIDs,
    }) => {
      try {
        onConfirm(
          updateType,
          rejectExistingComments,
          banSiteIDs,
          unbanSiteIDs,
          customMessage
        );

        return;
      } catch (err) {
        return { [FORM_ERROR]: err.message };
      }
    },
    [onConfirm]
  );

  return (
    <ChangeStatusModal
      open={open}
      onClose={onClose}
      aria-labelledby="banModal-title"
    >
      {({ lastFocusableRef }) => (
        <Form
          onSubmit={onFormSubmit}
          initialValues={{
            updateType:
              userBanStatus?.sites?.length || userBanStatus?.active
                ? UpdateType.SPECIFIC_SITES
                : UpdateType.ALL_SITES,
            sendCustomMessage: false,
            rejectExistingComments: false,
            customMessage: getDefaultMessage,
            banSiteIDs: [],
            unbanSiteIDs: [],
          }}
        >
          {({
            handleSubmit,
            submitError,
            values: { updateType, sendCustomMessage, banSiteIDs, unbanSiteIDs },
          }) => {
            const {
              title,
              titleLocalizationId,
              consequence,
              consequenceLocalizationId,
            } = getTextForUpdateType(updateType);

            const noSitesSelected =
              (banSiteIDs as string[]).length +
                (unbanSiteIDs as string).length ===
              0;

            return (
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
                <form onSubmit={handleSubmit}>
                  <HorizontalGutter spacing={3}>
                    {!isSiteMod && updateType !== UpdateType.NO_SITES && (
                      <Field name="rejectExistingComments" type="checkbox">
                        {({ input }) => (
                          <Localized id="community-banModal-reject-existing">
                            <CheckBox id="banModal-rejectExisting" {...input}>
                              Reject all comments by this user
                            </CheckBox>
                          </Localized>
                        )}
                      </Field>
                    )}
                    {updateType !== UpdateType.NO_SITES && (
                      <Field name="sendCustomMessage" type="checkbox">
                        {({ input }) => (
                          <Localized id="community-banModal-customize">
                            <CheckBox id="banModal-showMessage" {...input}>
                              Customize ban email message
                            </CheckBox>
                          </Localized>
                        )}
                      </Field>
                    )}
                    {sendCustomMessage && updateType !== UpdateType.NO_SITES && (
                      <Field name="customMessage" type="text">
                        {({ input }) => (
                          <Textarea
                            id="banModal-message"
                            className={styles.textArea}
                            fullwidth
                            {...input}
                          />
                        )}
                      </Field>
                    )}

                    {(viewerIsAdmin ||
                      viewerIsOrgAdmin ||
                      (viewerIsScoped && !viewerIsSingleSiteMod)) && (
                      <Flex className={styles.sitesToggle} spacing={5}>
                        <FormField>
                          <Field
                            name="updateType"
                            type="radio"
                            value={UpdateType.ALL_SITES}
                          >
                            {({ input }) => (
                              <Localized id="community-banModal-allSites">
                                <RadioButton
                                  {...input}
                                  disabled={userBanStatus?.active}
                                >
                                  All sites
                                </RadioButton>
                              </Localized>
                            )}
                          </Field>
                        </FormField>
                        <FormField>
                          <Field
                            name="updateType"
                            type="radio"
                            value={UpdateType.SPECIFIC_SITES}
                          >
                            {({ input }) => (
                              <Localized id="community-banModal-specificSites">
                                <RadioButton {...input}>
                                  Specific Sites
                                </RadioButton>
                              </Localized>
                            )}
                          </Field>
                        </FormField>
                        {!viewerIsScoped && (
                          <FormField>
                            <Field
                              name="updateType"
                              type="radio"
                              value={UpdateType.NO_SITES}
                            >
                              {({ input }) => (
                                <Localized id="community-banModal-noSites">
                                  <RadioButton {...input}>No Sites</RadioButton>
                                </Localized>
                              )}
                            </Field>
                          </FormField>
                        )}
                      </Flex>
                    )}

                    {!!moderationScopesEnabled &&
                      updateType === UpdateType.SPECIFIC_SITES && (
                        <UserStatusSitesList
                          userBanStatus={userBanStatus}
                          viewerScopes={viewerScopes}
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
                            noSitesSelected &&
                            updateType === UpdateType.SPECIFIC_SITES
                          }
                        >
                          Save
                        </Button>
                      </Localized>
                    </Flex>
                  </HorizontalGutter>
                </form>
              </HorizontalGutter>
            );
          }}
        </Form>
      )}
    </ChangeStatusModal>
  );
};

const enhanced = withGetMessage(BanModal);

export default enhanced;
