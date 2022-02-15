import {
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";
import { IntermediateModerationPhase } from "..";

export const tagMember: IntermediateModerationPhase = ({ author }) => {
  // TODO (marcushaddon): make sure author is member of site!
  return {
    tags: author.role === GQLUSER_ROLE.MEMBER ? [GQLTAG.MEMBER] : [],
  };
};
