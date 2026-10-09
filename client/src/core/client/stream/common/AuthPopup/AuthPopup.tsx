import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { urls } from "coral-framework/helpers";
import { AUTH_HANDOFF_PARAM } from "coral-framework/lib/auth/handoff";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useLocal } from "coral-framework/lib/relay";
import Popup from "coral-ui/components/v2/Popup";

import { AuthPopup_local } from "coral-stream/__generated__/AuthPopup_local.graphql";

const AuthPopup: FunctionComponent = () => {
  const { rootURL } = useCoralContext();
  const [local, setLocal] = useLocal<AuthPopup_local>(graphql`
    fragment AuthPopup_local on Local {
      authPopup {
        open
        focus
        view
        handoffID
      }
    }
  `);
  const { view, open, focus, handoffID } = local.authPopup;
  const handleClose = useCallback(() => {
    setLocal({
      authPopup: {
        open: false,
      },
    });
  }, [setLocal]);

  // The handoff ID lets the popup pass its token back through the server if
  // it loses window.opener, see OnAuthHandoff.
  const handoff = handoffID ? `&${AUTH_HANDOFF_PARAM}=${handoffID}` : "";

  return (
    <Popup
      href={`${rootURL}${urls.embed.auth}?view=${view}${handoff}`}
      title="Coral Auth"
      open={open}
      focus={focus}
      onClose={handleClose}
      features={{ width: 350, innerWidth: 350 }}
    />
  );
};

export default AuthPopup;
