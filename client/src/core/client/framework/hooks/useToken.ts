import { useEffect, useState } from "react";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useFetch } from "coral-framework/lib/relay";
import { Fetch } from "coral-framework/lib/relay/fetch";

type TokenState = "VALID" | "INVALID" | "MISSING" | "UNKNOWN" | "UNCHECKED";

interface Variables {
  token: string;
}

export default function useToken(
  fetcher: Fetch<string, Variables, Promise<void>>,
  token: string | undefined
): [TokenState, string] {
  const checkToken = useFetch(fetcher);
  const [tokenState, setTokenState] = useState<TokenState>("UNCHECKED");
  const [tokenError, setTokenError] = useState<string>("");

  useEffect(() => {
    let disposed = false;

    function handleTokenState(state: TokenState, error?: Error) {
      if (disposed) {
        return;
      }

      setTokenState(state);
      if (error) {
        setTokenError(error.message);
      }
    }

    if (token) {
      checkToken({ token })
        .then(() => {
          handleTokenState("VALID");
        })
        .catch((error) => {
          if (error instanceof InvalidRequestError) {
            handleTokenState("INVALID", error);
          } else {
            handleTokenState("UNKNOWN", error);
          }
        });
    } else {
      handleTokenState("MISSING");
    }

    return () => {
      disposed = true;
    };
  }, [token]);

  return [tokenState, tokenError];
}
