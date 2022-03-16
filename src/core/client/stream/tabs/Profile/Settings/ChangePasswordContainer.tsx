import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { urls } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  useLocal,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { ShowAuthPopupMutation } from "coral-stream/common/AuthPopup";
import SetAuthPopupStateMutation from "coral-stream/common/AuthPopup/SetAuthPopupStateMutation";
import { Popup } from "coral-ui/components/v2";

import { ChangePasswordContainer_settings } from "coral-stream/__generated__/ChangePasswordContainer_settings.graphql";
import { ChangePasswordContainerLocal } from "coral-stream/__generated__/ChangePasswordContainerLocal.graphql";

import ChangePassword from "./ChangePassword";

interface Props {
  settings: ChangePasswordContainer_settings;
}

const ChangePasswordContainer: FunctionComponent<Props> = ({ settings }) => {
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
  const { rootURL } = useCoralContext();
  const setAuthPopupState = useMutation(SetAuthPopupStateMutation);
  const showAuthPopup = useMutation(ShowAuthPopupMutation);
  const onResetPassword = useCallback(() => {
    void showAuthPopup({ view: "FORGOT_PASSWORD" });
  }, [showAuthPopup]);
  const onClose = useCallback(() => {
    void setAuthPopupState({ open: false });
  }, [setAuthPopupState]);

  if (
    !settings.auth.integrations.local.enabled ||
    !settings.auth.integrations.local.targetFilter.stream
  ) {
    return null;
  }

  return (
    <>
      <Popup
        href={`${rootURL}${urls.embed.auth}?view=${view}`}
        title="Coral Auth"
        open={open}
        focus={focus}
        onClose={onClose}
      />
      <ChangePassword onResetPassword={onResetPassword} />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
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
})(ChangePasswordContainer);

export default enhanced;
