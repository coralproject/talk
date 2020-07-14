import { createFetch } from "coral-server/services/fetch";

const fetchURL = (url: string, type: "twitter" | "youtube") => {
  if (type === "twitter") {
    return `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
  }
  if (type === "youtube") {
    return `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}`;
  }

  return "";
};

const fetch = createFetch({ name: "oembed-fetch" });

export function fetchOembedResponse(url: string, type: "twitter" | "youtube") {
  return fetch(fetchURL(url, type));
}
