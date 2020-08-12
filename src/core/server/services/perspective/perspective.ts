import path from "path";
import { URL } from "url";

import { TOXICITY_ENDPOINT_DEFAULT } from "coral-common/constants";
import { LanguageCode } from "coral-common/helpers";
import { getURLWithCommentID } from "coral-server/models/story";
import { fetchWithTimeout } from "coral-server/services/fetch";

/**
 * Language is the language key that is supported by the Perspective API in the
 * ISO 631-1 format.
 *
 * The current list of supported languages can be found:
 *  https://github.com/conversationai/perspectiveapi/blob/master/2-api/models.md#languages-in-production
 */
type PerspectiveLanguage = "en" | "es" | "fr" | "de" | "pt";

/**
 * convertLanguage returns the language code for the related Perspective API
 * model in the ISO 631-1 format.
 *
 * @param locale the language on the tenant in the BCP 47 format.
 */
function convertLanguage(locale: LanguageCode): PerspectiveLanguage {
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

interface Options {
  endpoint?: string | null;
  key: string;
  timeout: number;
}

type Request =
  | {
      operation: "comments:analyze";
      locale: LanguageCode;
      body: {
        /**
         * text respresentation of the comment html body.
         */
        text: string;
        doNotStore: boolean;
        model: string;
      };
    }
  | {
      operation: "comments:suggestscore";
      locale: LanguageCode;
      body: {
        /**
         * text respresentation of the comment html body.
         */
        text: string;
        commentID: string;
        commentParentID?: string;
        commentStatus: "APPROVED" | "DELETED";
        storyURL: string;
        tenantURL: string;
      };
    };

function formatBody(req: Request): object {
  // Get the language from the locale. This won't be a 1-1 mapping because the
  // Perspective API doesn't support all the languages that Coral supports in
  // production.
  const language = convertLanguage(req.locale);

  switch (req.operation) {
    case "comments:analyze":
      return {
        comment: {
          text: req.body.text,
        },
        doNotStore: req.body.doNotStore,
        requestedAttributes: {
          [req.body.model]: {},
        },
        languages: [language],
      };
    case "comments:suggestscore":
      return {
        comment: {
          text: req.body.text,
        },
        context: {
          entries: [
            {
              text: JSON.stringify({
                url: getURLWithCommentID(req.body.storyURL, req.body.commentID),
                reply_to_id_Coral_comment_id: req.body.commentParentID,
                Coral_comment_id: req.body.commentID,
              }),
            },
          ],
        },
        attributeScores: {
          [status]: {
            summaryScore: {
              value: 1,
            },
          },
        },
        languages: [language],
        communityId: `Coral:${req.body.tenantURL}`,
        clientToken: `comment:${req.body.commentID}`,
      };
  }
}

export async function sendToPerspective(
  { endpoint, key, timeout }: Options,
  req: Request
) {
  // Prepare the URL to send the command to.
  const url = new URL((endpoint || TOXICITY_ENDPOINT_DEFAULT).trim());
  url.pathname = path.join(url.pathname, `/${req.operation}`);
  url.searchParams.set("key", key.trim());

  // Convert the request to a body to be sent to perspective.
  const body = JSON.stringify(formatBody(req));

  try {
    // Create the request and send it.
    const res = await fetchWithTimeout(
      "perspective",
      url.toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      },
      timeout
    );
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
