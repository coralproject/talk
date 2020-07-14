import { createFetch } from "coral-server/services/fetch";

const fetchURL = (url: string, type: string) => {
  if (type === "twitter") {
    return `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
  }
  if (type === "youtube") {
    return `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}`;
  }

  return "";
};

export function fetchOembedResponse(url: string, type: string) {
  const fetch = createFetch({ name: "oembed-fetch" });

  return fetch(fetchURL(url, type));
}
