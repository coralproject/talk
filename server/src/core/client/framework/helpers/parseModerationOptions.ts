import { Match } from "found";

import { Options } from "./getModerationLink";

type ReturnType = Omit<Required<Options>, "queue">;

export default function parseModerationOptions(match: Match): ReturnType {
  const options: ReturnType = {
    commentID: null,
    section: null,
    siteID: null,
    storyID: null,
  };

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
