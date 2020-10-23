import { Localized } from "@fluent/react/compat";
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

import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import ChangeStatusModal from "./ChangeStatusModal";
import { Scopes } from "./UserStatusSitesListContainer";
import UserStatusSitesListQuery from "./UserStatusSitesListQuery";

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

  const onFormSubmit = useCallback(
    (input) => {
      onConfirm(
        input.rejectExistingComments,
        input.emailMessage,
        input.sites?.map((s: any) => s.id)
      );
    },
    [onConfirm]
  );

  const initialSiteIDs = useMemo(() => {
    if (
      viewerScopes.role === GQLUSER_ROLE.MODERATOR &&
      viewerScopes.sites &&
      viewerScopes.sites?.length > 0
    ) {
      return viewerScopes.sites ? viewerScopes.sites : [];
    }

    return userScopes.sites ? userScopes.sites : [];
  }, [userScopes.sites, viewerScopes.role, viewerScopes.sites]);

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
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <HorizontalGutter spacing={3}>
                  <Field type="checkbox" name="rejectExistingComments">
                    {({ input }) => (
                      <Localized id="community-banModal-reject-existing">
                        <CheckBox {...input} id="banModal-rejectExisting">
                          Reject all comments by this user
                        </CheckBox>
                      </Localized>
                    )}
                  </Field>
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
                    <UserStatusSitesListQuery
                      viewerScopes={viewerScopes}
                      userScopes={userScopes}
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
