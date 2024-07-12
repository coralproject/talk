import { useCallback } from "react";
import { graphql } from "react-relay";

import { useFetchWithAuth_local } from "coral-stream/__generated__/useFetchWithAuth_local.graphql";

import { useLocal } from "../../framework/lib/relay";

const useFetchWithAuth = () => {
  const [{ accessToken }] = useLocal<useFetchWithAuth_local>(graphql`
    fragment useFetchWithAuth_local on Local {
      accessToken
    }
  `);

  const fetchWithAuth = useCallback(
    async (input: RequestInfo, init?: RequestInit) => {
      const params = {
        ...init,
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      };

      const response = await fetch(input, params);

      return response;
    },
    [accessToken]
  );

  return fetchWithAuth;
};

export default useFetchWithAuth;
