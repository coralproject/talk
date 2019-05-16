import { Localized } from "fluent-react/compat";
import React, { useEffect, useState } from "react";

import { CheckResetTokenFetch } from "coral-account/fetches";
import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useFetch } from "coral-framework/lib/relay";
import { Delay, Flex, Spinner } from "coral-ui/components";

import Sorry from "./Sorry";

interface Props {
  token: string | undefined;
}

type TokenState =
  | "VALID"
  | "INVALID"
  | "EXPIRED"
  | "MISSING"
  | "RATE_LIMIT_EXCEEDED"
  | "UNKNOWN"
  | "UNCHECKED";

const ResetTokenChecker: React.FunctionComponent<Props> = ({
  token,
  children,
}) => {
  const checkResetToken = useFetch(CheckResetTokenFetch);
  const [tokenState, setTokenState] = useState<TokenState>("UNCHECKED");
  const [reason, setReason] = useState<string>("");
  useEffect(() => {
    if (token) {
      async function setAndCheckToken() {
        try {
          await checkResetToken({ token: token! });
          setTokenState("VALID");
        } catch (e) {
          setReason(e.message);
          if (e instanceof InvalidRequestError) {
            switch (e.code) {
              case ERROR_CODES.RATE_LIMIT_EXCEEDED:
                setTokenState("RATE_LIMIT_EXCEEDED");
                return;
              case ERROR_CODES.PASSWORD_RESET_TOKEN_EXPIRED:
                setTokenState("EXPIRED");
                return;
              case ERROR_CODES.INTEGRATION_DISABLED:
              case ERROR_CODES.USER_NOT_FOUND:
              case ERROR_CODES.TOKEN_INVALID:
                setTokenState("INVALID");
                return;
              default:
                setTokenState("UNKNOWN");
                return;
            }
          }
          setTokenState("UNKNOWN");
        }
      }
      setAndCheckToken();
    } else {
      setTokenState("MISSING");
    }
    return;
  }, [token]);

  switch (tokenState) {
    case "VALID":
      return <>{children}</>;
    case "UNCHECKED":
      return (
        <Flex justifyContent="center">
          <Delay>
            <Spinner />
          </Delay>
        </Flex>
      );
    case "MISSING":
      return (
        <Sorry
          reason={
            <Localized id="resetPassword-missingResetToken">
              <span>The Reset Token seems to be missing.</span>
            </Localized>
          }
        />
      );
    default:
      return <Sorry reason={reason} />;
  }
};

export default ResetTokenChecker;
