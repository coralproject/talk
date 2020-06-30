import { URL } from "url";

import { GIPHY_FETCH, GIPHY_SEARCH } from "coral-common/constants";
import { LanguageCode } from "coral-common/helpers";
import { createFetch } from "coral-server/services/fetch";

const API_KEY = process.env.GIPHY_KEY || "";

const fetch = createFetch({ name: "giphy" });

type GiphyLanguage = "en" | "es" | "fr" | "de" | "pt";

/**
 * convertLanguage returns the language code for the related Perspective API
 * model in the ISO 631-1 format.
 *
 * @param locale the language on the tenant in the BCP 47 format.
 */
function convertLanguage(locale: LanguageCode): GiphyLanguage {
  switch (locale) {
    case "en-US":
      return "en";
    case "es":
      return "es";
    case "fr-FR":
      return "fr";
    case "de":
      return "de";
    case "pt-BR":
      return "pt";
    default:
      return "en";
  }
}

export async function searchGiphy(
  query: string,
  offset: string,
  locale: LanguageCode
) {
  const language = convertLanguage(locale);
  const url = new URL(GIPHY_SEARCH);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("limit", "8");
  url.searchParams.set("lang", language);
  url.searchParams.set("offset", offset);
  url.searchParams.set("q", query);

  try {
    const res = await fetch(url.toString());

    if (!res.ok) {
      return {
        ok: res.ok,
        status: res.status,
        data: null,
      };
    }

    // Parse the JSON body and send back the result!
    const data = await res.json();
    return {
      ok: res.ok,
      status: res.status,
      data,
    };
  } catch (err) {
    // Ensure that the API key doesn't get leaked to the logs by accident.
    if (err.message) {
      err.message = err.message.replace(
        url.searchParams.toString(),
        "[Sensitive]"
      );
    }

    // Rethrow the error.
    throw err;
  }
}

export async function fetchFromGiphy(id: string) {
  const url = new URL(`${GIPHY_FETCH}/${id}`);
  try {
    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error("unable to fetch");
    }

    // Parse the JSON body and send back the result!
    const result = await res.json();
    return result.data;
  } catch (err) {
    // Ensure that the API key doesn't get leaked to the logs by accident.
    if (err.message) {
      err.message = err.message.replace(
        url.searchParams.toString(),
        "[Sensitive]"
      );
    }

    // Rethrow the error.
    throw err;
  }
}
