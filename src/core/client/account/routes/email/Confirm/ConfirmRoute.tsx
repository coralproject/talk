import React, { useCallback, useState } from "react";

import { withRouteConfig } from "coral-framework/lib/router";
import { parseHashQuery } from "coral-framework/utils";

import ConfirmForm from "./ConfirmForm";
import ConfirmTokenChecker from "./ConfirmTokenChecker";
import Success from "./Success";

interface Props {
  token: string | undefined;
}

const ConfirmRoute: React.FunctionComponent<Props> = ({ token }) => {
  const [suceeded, setSuceeded] = useState<boolean>(false);
  const onSuccess = useCallback(() => {
    setSuceeded(true);
  }, []);
  return (
    <ConfirmTokenChecker token={token}>
      {!suceeded && <ConfirmForm token={token!} onSuccess={onSuccess} />}
      {suceeded && <Success />}
    </ConfirmTokenChecker>
  );
};

const enhanced = withRouteConfig<Props>({
  render: ({ match, Component }) => (
    <Component token={parseHashQuery(match.location.hash).confirmToken} />
  ),
})(ConfirmRoute);

export default enhanced;
