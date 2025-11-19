import { User } from "coral-server/models/user";
import { authorIsIgnored } from "coral-server/models/user/helpers";

export const shouldSendReplyNotification = (
  replyAuthorID: string | null,
  targetUser: Readonly<User>
) => {
  if (replyAuthorID) {
    // don't notify on replies to own comments
    if (replyAuthorID === targetUser.id) {
      return false;
    }
    // don't notify when ignored users reply
    return !authorIsIgnored(replyAuthorID, targetUser);
  }

  return false;
};
