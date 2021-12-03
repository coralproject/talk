import { UpdateType } from "./BanModal";

export const getTextForUpdateType = (mode: UpdateType) => {
  switch (mode) {
    case UpdateType.ALL_SITES:
      return {
        title: "Are you sure you want to ban",
        titleLocalizationId: "community-banModal-allSites-title",
        consequence:
          "Once banned, this user will no longer be able to comment, use reactions, or report comments.",
        consequenceLocalizationId: "community-banModal-allSites-consequence",
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
      };
  }
};
