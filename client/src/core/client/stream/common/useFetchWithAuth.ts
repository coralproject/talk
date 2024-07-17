import { useCallback } from "react";
import { graphql } from "react-relay";

import { buildURL, parseURL } from "coral-framework/utils";

import { useFetchWithAuth_local } from "coral-stream/__generated__/useFetchWithAuth_local.graphql";

import { useLocal } from "../../framework/lib/relay";

const processURL = (url: string) => {
  const parsedURL = parseURL(url);
  return buildURL(parsedURL);
};

const useFetchWithAuth = () => {
  const [{ accessToken }] = useLocal<useFetchWithAuth_local>(graphql`
    fragment useFetchWithAuth_local on Local {
      accessToken
    }
  `);

  const fetchWithAuth = useCallback(
    async (url: string, init?: RequestInit) => {
      const params = {
        ...init,
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      };

      const processedURL = processURL(url);
      const response = await fetch(processedURL, params);

      return response;
    },
    [accessToken]
  );

  return fetchWithAuth;
};

export default useFetchWithAuth;
