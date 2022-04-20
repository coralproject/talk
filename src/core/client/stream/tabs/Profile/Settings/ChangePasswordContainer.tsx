import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { urls } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";
import useAuthPopupActions from "coral-stream/common/AuthPopup/useAuthPopupActions";
import { useStreamLocal } from "coral-stream/local/StreamLocal";
import { Popup } from "coral-ui/components/v2";

import { ChangePasswordContainer_settings } from "coral-stream/__generated__/ChangePasswordContainer_settings.graphql";

import ChangePassword from "./ChangePassword";

interface Props {
  settings: ChangePasswordContainer_settings;
}

const ChangePasswordContainer: FunctionComponent<Props> = ({ settings }) => {
  const {
    authPopup: { open, focus, view },
  } = useStreamLocal();
  const [{ show: showPopup, setState: setPopupState }] = useAuthPopupActions();
  const { rootURL } = useCoralContext();
  const onResetPassword = useCallback(() => {
    showPopup({ view: "FORGOT_PASSWORD" });
  }, [showPopup]);
  const onClose = useCallback(() => {
    setPopupState({ open: false });
  }, [setPopupState]);

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
