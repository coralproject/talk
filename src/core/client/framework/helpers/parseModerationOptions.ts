import { Match } from "found";

import { Options } from "./getModerationLink";

export default function parseModerationOptions(
  match: Match
): Omit<Options, "queue"> {
  const options: Options = {};

  if (match.params.storyID) {
    options.storyID = match.params.storyID;
  }

  if (match.params.siteID) {
    options.siteID = match.params.siteID;
  }

  if (typeof match.location.query.section === "string") {
    const section = match.location.query.section;
    options.section = section
      ? {
          name: section,
        }
      : {
          name: null,
        };
  }

  return options;
}
