import React, { useCallback, useState } from "react";

import { withRouteConfig } from "talk-framework/lib/router";

import { parseHashQuery } from "talk-framework/utils";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetTokenChecker from "./ResetTokenChecker";
import Success from "./Success";

interface Props {
  token: string | undefined;
}

const Index: React.FunctionComponent<Props> = ({ token }) => {
  const [suceeded, setSuceeded] = useState<boolean>(false);
  const onSuccess = useCallback(() => {
    setSuceeded(true);
  }, []);
  return (
    <ResetTokenChecker token={token}>
      {!suceeded && <ResetPasswordForm token={token!} onSuccess={onSuccess} />}
      {suceeded && <Success />}
    </ResetTokenChecker>
  );
};

const enhanced = withRouteConfig<Props>({
  render: ({ match, Component }) => (
    <Component token={parseHashQuery(match.location.hash).resetToken} />
  ),
})(Index);

export default enhanced;
