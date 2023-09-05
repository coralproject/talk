import {
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";
import { IntermediateModerationPhase } from "..";

export const tagMember: IntermediateModerationPhase = ({ author, story }) => {
  const isMember = author.role === GQLUSER_ROLE.MEMBER;
  const isScoped = !!author.membershipScopes?.siteIDs?.length;
  const inScope =
    isScoped && author.membershipScopes!.siteIDs!.includes(story.siteID);
  const tagAsMember = isMember && (!isScoped || inScope);

  return {
    tags: tagAsMember ? [GQLTAG.MEMBER] : [],
  };
};
