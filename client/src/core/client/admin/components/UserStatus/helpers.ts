import { UpdateType } from "../BanModal";

export const getTextForUpdateType = (mode: UpdateType) => {
  switch (mode) {
    case UpdateType.ALL_SITES:
      return {
        title: "Are you sure you want to ban",
        titleLocalizationId: "community-banModal-allSites-title",
        consequence:
          "Once banned, this user will no longer be able to comment, use reactions, or report comments.",
        consequenceLocalizationId: "community-banModal-allSites-consequence",
        rejectExistingCommentsLocalizationId:
          "community-banModal-reject-existing",
        rejectExistingCommentsMessage: "Reject all comments by this user",
      };
    case UpdateType.NO_SITES:
      return {
        title: "Are you sure you want to unban",
        titleLocalizationId: "community-banModal-noSites-title",
        consequence:
          "Once unbanned, this user will be able to comment, use reactions, and report comments.",
        consequenceLocalizationId: "community-banModal-noSites-consequence",
      };
    case UpdateType.SPECIFIC_SITES:
      return {
        title: "Are you sure you want to update ban status of",
        titleLocalizationId: "community-banModal-specificSites-title",
        consequence:
          "This action will affect which sites on which the user is able to comment, use reactions, and report comments.",
        consequenceLocalizationId:
          "community-banModal-specificSites-consequence",
        rejectExistingCommentsLocalizationId:
          "community-banModal-reject-existing-specificSites",
        rejectExistingCommentsMessage: "Reject all comments on these sites",
      };
  }
};

export const dedupe = <T>(items: T[], predicate?: (item: T) => T[keyof T]) => {
  const seen = new Set();
  return items.reduce((unique, current) => {
    const val = predicate ? predicate(current) : current;
    let u = unique;
    if (!seen.has(val)) {
      u = [...unique, current];
    }
    seen.add(val);

    return u;
  }, [] as T[]);
};
