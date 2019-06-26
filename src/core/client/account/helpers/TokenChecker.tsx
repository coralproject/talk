import { Localized } from "fluent-react/compat";
import React, { useEffect, useState } from "react";

import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useFetch } from "coral-framework/lib/relay";
import { Fetch } from "coral-framework/lib/relay/fetch";
import { Delay, Flex, Spinner } from "coral-ui/components";

interface ChildrenProps {
  err?: React.ReactNode;
}

interface Props {
  token: string | undefined;
  fetcher: Fetch<string, { token: string }, Promise<void>>;
  children: (props: ChildrenProps) => React.ReactNode;
}

type TokenState =
  | "VALID"
  | "INVALID"
  | "MISSING"
  | "RATE_LIMIT_EXCEEDED"
  | "UNKNOWN"
  | "UNCHECKED";

const TokenChecker: React.FunctionComponent<Props> = ({
  token,
  fetcher,
  children,
}) => {
  const checkToken = useFetch(fetcher);
  const [tokenState, setTokenState] = useState<TokenState>("UNCHECKED");
  const [reason, setReason] = useState<string>("");
  useEffect(() => {
    let disposed = false;
    if (token) {
      async function setAndCheckToken() {
        try {
          await checkToken({ token: token! });
          if (disposed) {
            return;
          }
          setTokenState("VALID");
        } catch (e) {
          if (disposed) {
            return;
          }
          setReason(e.message);
          if (e instanceof InvalidRequestError) {
            switch (e.code) {
              case ERROR_CODES.RATE_LIMIT_EXCEEDED:
                setTokenState("RATE_LIMIT_EXCEEDED");
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
    return () => {
      disposed = true;
    };
  }, [token]);

  switch (tokenState) {
    case "VALID":
      return <>{children({})}</>;
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
        <>
          {children({
            err: (
              <Localized id="account-tokenNotFound">
                <span data-testid="invalid-link">
                  The specified link is invalid, check to see if it was copied
                  correctly.
                </span>
              </Localized>
            ),
          })}
        </>
      );
    default:
      return <>{children({ err: reason })}</>;
  }
};

export default TokenChecker;
