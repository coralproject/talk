import React, { FunctionComponent, useCallback } from "react";

import { urls } from "coral-framework/helpers";
import Popup from "coral-ui/components/v2/Popup";

import { useStreamLocal } from "coral-stream/local/StreamLocal";

const AuthPopup: FunctionComponent = () => {
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
