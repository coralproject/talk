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
  HorizontalGutter,
  Textarea,
} from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import ChangeStatusModal from "./ChangeStatusModal";
import UserStatusSitesList, { Scopes } from "./UserStatusSitesList";

import styles from "./BanModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (
    rejectExistingComments: boolean,
    message?: string,
    siteIDs?: string[] | null | undefined
  ) => void;
  getMessage: GetMessage;

  moderationScopesEnabled?: boolean | null;
  viewerScopes: Scopes;
  userScopes: Scopes;
}

const BanModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  getMessage,
  moderationScopesEnabled,
  viewerScopes,
  userScopes,
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

  const isSiteMod =
    !!moderationScopesEnabled &&
    viewerScopes.role === GQLUSER_ROLE.MODERATOR &&
    !!viewerScopes.sites &&
    viewerScopes.sites?.length > 0;

  const onFormSubmit = useCallback(
    (input) => {
      try {
        let selectedIDs = input.selectedIDs || [];

        // single site mods can only ban for their
        // one assigned site, override anything else that
        // might come through
        if (
          isSiteMod &&
          viewerScopes.sites &&
          viewerScopes.sites.length === 1
        ) {
          selectedIDs = [viewerScopes.sites[0].id];
        }

        if (isSiteMod && (!selectedIDs || selectedIDs.length === 0)) {
          return { [FORM_ERROR]: "At least one site must be selected" };
        }

        onConfirm(
          input.rejectExistingComments,
          input.emailMessage,
          selectedIDs
        );

        return;
      } catch (err) {
        return { [FORM_ERROR]: err.message };
      }
    },
    [isSiteMod, onConfirm, viewerScopes.sites]
  );

  const initialSiteIDs = useMemo(() => {
    if (isSiteMod) {
      return viewerScopes.sites ? viewerScopes.sites : [];
    }

    return userScopes.sites ? userScopes.sites : [];
  }, [isSiteMod, userScopes.sites, viewerScopes.sites]);

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
              id="community-banModal-areYouSure"
              strong={<ModalHeaderUsername />}
              username={React.createElement(() => (
                <strong>{username || <NotAvailable />}</strong>
              ))}
            >
              <ModalHeader id="banModal-title">
                Are you sure you want to ban{" "}
                <ModalHeaderUsername>
                  {username || <NotAvailable />}
                </ModalHeaderUsername>
                ?
              </ModalHeader>
            </Localized>
            <Localized id="community-banModal-consequence">
              <p className={styles.bodyText}>
                Once banned, this user will no longer be able to comment, use
                reactions, or report comments.
              </p>
            </Localized>
          </HorizontalGutter>
          <Form
            onSubmit={onFormSubmit}
            initialValues={{
              showMessage: false,
              rejectExistingComments: false,
              emailMessage: getDefaultMessage,
              siteIDs: initialSiteIDs,
              selectedIDs: [],
            }}
          >
            {({ handleSubmit, submitError }) => (
              <form onSubmit={handleSubmit}>
                <HorizontalGutter spacing={3}>
                  {!isSiteMod && (
                    <Field type="checkbox" name="rejectExistingComments">
                      {({ input }) => (
                        <Localized id="community-banModal-reject-existing">
                          <CheckBox {...input} id="banModal-rejectExisting">
                            Reject all comments by this user
                          </CheckBox>
                        </Localized>
                      )}
                    </Field>
                  )}
                  <Field type="checkbox" name="showMessage">
                    {({ input }) => (
                      <Localized id="community-banModal-customize">
                        <CheckBox {...input} id="banModal-showMessage">
                          Customize ban email message
                        </CheckBox>
                      </Localized>
                    )}
                  </Field>
                  <Field name="showMessage" subscription={{ value: true }}>
                    {({ input: { value } }) =>
                      value ? (
                        <Field name="emailMessage">
                          {({ input }) => (
                            <Textarea
                              id="banModal-message"
                              className={styles.textArea}
                              fullwidth
                              {...input}
                            />
                          )}
                        </Field>
                      ) : null
                    }
                  </Field>

                  {moderationScopesEnabled && (
                    <UserStatusSitesList viewerScopes={viewerScopes} />
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
                    <Localized id="community-banModal-banUser">
                      <Button type="submit" ref={lastFocusableRef}>
                        Ban User
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
