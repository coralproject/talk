export interface SeenCommentsKey {
  userID: string;
  storyID: string;
}

export default class SeenCommentsCollection {
  private comments: Map<string, string[]>;

  constructor() {
    this.comments = new Map<string, string[]>();
  }

  private computeKey(userID: string, storyID: string) {
    return `${userID}:${storyID}`;
  }

  public insert(userID: string, storyID: string, commentID: string) {
    const key = this.computeKey(userID, storyID);
    const toBeMarkedComments = this.comments.get(key);

    if (!toBeMarkedComments) {
      this.comments.set(key, [commentID]);
    } else {
      toBeMarkedComments.push(commentID);
    }
  }

  public insertMany(userID: string, storyID: string, commentIDs: string[]) {
    commentIDs.forEach((id) => {
      this.insert(userID, storyID, id);
    });
  }

  public idsForStory(userID: string, storyID: string): string[] {
    const key = this.computeKey(userID, storyID);
    const commentIDs = this.comments.get(key);

    if (!commentIDs) {
      return [];
    }

    return commentIDs;
  }

  public keys(): SeenCommentsKey[] {
    const keys: SeenCommentsKey[] = [];

    for (const [key] of this.comments) {
      const split = key.split(":");
      const userID = split[0];
      const storyID = split[1];

      keys.push({
        userID,
        storyID,
      });
    }

    return keys;
  }
}
