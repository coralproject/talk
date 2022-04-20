import React, { FunctionComponent, useCallback } from "react";

import { urls } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useStreamLocal } from "coral-stream/local/StreamLocal";
import Popup from "coral-ui/components/v2/Popup";

const AuthPopup: FunctionComponent = () => {
  const { rootURL } = useCoralContext();
  const { authPopup } = useStreamLocal();
  const { view, open, setOpen, focus, setFocus } = authPopup;

  const handleFocus = useCallback(() => {
    setFocus(true);
  }, [setFocus]);
  const handleBlur = useCallback(() => {
    setFocus(false);
  }, [setFocus]);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Popup
      href={`${rootURL}${urls.embed.auth}?view=${view}`}
      title="Coral Auth"
      open={open}
      focus={focus}
      onClose={handleClose}
      onFocus={handleFocus}
      onBlur={handleBlur}
      features={{ width: 350, innerWidth: 350 }}
    />
  );
};

export default AuthPopup;
