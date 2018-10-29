import { GQLStoryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action";
import { Story } from "talk-server/models/story";

const Story: GQLStoryTypeResolver<Story> = {
  comments: (story, input, ctx) =>
    ctx.loaders.Comments.forStory(story.id, input),
  // TODO: implement this.
  isClosed: () => false,
  actionCounts: story => decodeActionCounts(story.action_counts),
  commentCounts: story => story.comment_counts,
};

export default Story;
