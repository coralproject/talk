import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { urls } from "coral-framework/helpers";
import { useLocal, useMutation } from "coral-framework/lib/relay";
import { ShowAuthPopupMutation } from "coral-stream/common/AuthPopup";
import SetAuthPopupStateMutation from "coral-stream/common/AuthPopup/SetAuthPopupStateMutation";
import { Popup } from "coral-ui/components/v2";

import { ChangePasswordContainer_settings$key as ChangePasswordContainer_settings } from "coral-stream/__generated__/ChangePasswordContainer_settings.graphql";
import { ChangePasswordContainerLocal } from "coral-stream/__generated__/ChangePasswordContainerLocal.graphql";

import ChangePassword from "./ChangePassword";

interface Props {
  settings: ChangePasswordContainer_settings;
}

const ChangePasswordContainer: FunctionComponent<Props> = ({ settings }) => {
  const settingsData = useFragment(
    graphql`
      fragment ChangePasswordContainer_settings on Settings {
        auth {
          integrations {
            local {
              enabled
              targetFilter {
                stream
              }
            }
          }
        }
      }
    `,
    settings
  );

  const [
    {
      authPopup: { open, focus, view },
    },
  ] = useLocal<ChangePasswordContainerLocal>(graphql`
    fragment ChangePasswordContainerLocal on Local {
      authPopup {
        open
        focus
        view
      }
    }
  `);
  const setAuthPopupState = useMutation(SetAuthPopupStateMutation);
  const showAuthPopup = useMutation(ShowAuthPopupMutation);
  const onResetPassword = useCallback(() => {
    void showAuthPopup({ view: "FORGOT_PASSWORD" });
  }, [showAuthPopup]);
  const onFocus = useCallback(() => {
    void setAuthPopupState({ focus: true });
  }, [setAuthPopupState]);
  const onBlur = useCallback(() => {
    void setAuthPopupState({ focus: true });
  }, [setAuthPopupState]);
  const onClose = useCallback(() => {
    void setAuthPopupState({ open: false });
  }, [setAuthPopupState]);

  if (
    !settingsData.auth.integrations.local.enabled ||
    !settingsData.auth.integrations.local.targetFilter.stream
  ) {
    return null;
  }

  return (
    <>
      <Popup
        href={`${urls.embed.auth}?view=${view}`}
        title="Coral Auth"
        open={open}
        focus={focus}
        onFocus={onFocus}
        onBlur={onBlur}
        onClose={onClose}
      />
      <ChangePassword onResetPassword={onResetPassword} />
    </>
  );
};

export default ChangePasswordContainer;
