import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useFetch } from "coral-framework/lib/relay";
import { Delay, Flex, Spinner } from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import React, { useEffect, useState } from "react";

import CheckConfirmTokenFetch from "./CheckConfirmTokenFetch";
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

const ConfirmTokenChecker: React.FunctionComponent<Props> = ({
  token,
  children,
}) => {
  const checkConfirmToken = useFetch(CheckConfirmTokenFetch);
  const [tokenState, setTokenState] = useState<TokenState>("UNCHECKED");
  const [reason, setReason] = useState<string>("");
  useEffect(() => {
    if (token) {
      async function setAndCheckToken() {
        try {
          await checkConfirmToken({ token: token! });
          setTokenState("VALID");
        } catch (e) {
          setReason(e.message);
          if (e instanceof InvalidRequestError) {
            switch (e.code) {
              case ERROR_CODES.RATE_LIMIT_EXCEEDED:
                setTokenState("RATE_LIMIT_EXCEEDED");
                return;
              case ERROR_CODES.EMAIL_CONFIRM_TOKEN_EXPIRED:
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
            <Localized id="confirmEmail-missingConfirmToken">
              <span>The Confirm Token seems to be missing.</span>
            </Localized>
          }
        />
      );
    default:
      return <Sorry reason={reason} />;
  }
};

export default ConfirmTokenChecker;
