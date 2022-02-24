import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { urls } from "coral-framework/helpers";
import { useLocal } from "coral-framework/lib/relay";
import Popup from "coral-ui/components/v2/Popup";

import { AuthPopup_local$data as AuthPopup_local } from "coral-stream/__generated__/AuthPopup_local.graphql";

const AuthPopup: FunctionComponent = () => {
  const [local, setLocal] = useLocal<AuthPopup_local>(graphql`
    fragment AuthPopup_local on Local {
      authPopup {
        open
        focus
        view
      }
    }
  `);
  const { view, open, focus } = local.authPopup;
  const handleFocus = useCallback(() => {
    setLocal({
      authPopup: {
        focus: true,
      },
    });
  }, [setLocal]);
  const handleBlur = useCallback(() => {
    setLocal({
      authPopup: {
        focus: false,
      },
    });
  }, [setLocal]);
  const handleClose = useCallback(() => {
    setLocal({
      authPopup: {
        open: false,
      },
    });
  }, [setLocal]);

  return (
    <Popup
      href={`${urls.embed.auth}?view=${view}`}
      title="Coral Auth"
      open={open}
      focus={focus}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClose={handleClose}
      features={{ width: 350, innerWidth: 350 }}
    />
  );
};

export default AuthPopup;
