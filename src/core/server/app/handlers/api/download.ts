import archiver from "archiver";
import { AppOptions } from "coral-server/app";
import { retrieveManyStories } from "coral-server/models/story";
import { RequestHandler } from "coral-server/types/express";
import stringify from "csv-stringify";
import DataLoader from "dataloader";

interface User {
  readonly id: string;
  username: string;
}

interface Comment {
  readonly id: string;
  storyID: string;
  createdAt: string;
  revisions: Revision[];
}

interface Revision {
  readonly id: string;
  body: string;
  createdAt: string;
}

const BATCH_SIZE = 100;

export type DownloadOptions = Pick<AppOptions, "mongo">;

export const downloadHandler = ({ mongo }: DownloadOptions): RequestHandler => {
  return async (req, res, next) => {
    // tenant is guaranteed at this point
    const coral = req.coral!;
    const tenant = coral.tenant!;

    const users = mongo.collection<Readonly<User>>("users");
    const comments = mongo.collection<Readonly<Comment>>("comments");

    const user = await users.findOne({ username: "test" });
    const authorID = user!.id;
    const tenantID = tenant!.id;

    const getStories = new DataLoader((ids: string[]) =>
      retrieveManyStories(mongo, tenantID, ids)
    );
    const cursor = comments.find({ tenantID, authorID });

    let commentBatch: Array<Readonly<Comment>> = [];

    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=archive.zip`,
    });

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.pipe(res);

    const csv = stringify();
    archive.append(csv, { name: "comments-export/my_comments.csv" });

    csv.write([
      "Comment ID",
      "Revision ID",
      "Published Timestamp",
      "Article URL",
      "Comment Text",
    ]);

    const writeBatch = async () => {
      const stories = await getStories.loadMany(
        commentBatch.map(({ storyID }) => storyID)
      );

      for (let i = 0; i < commentBatch.length; i++) {
        const comment = commentBatch[i];
        const story = stories[i];
        if (!story) {
          continue;
        }

        for (const rev of comment.revisions) {
          csv.write([comment.id, rev.id, rev.createdAt, story.url, rev.body]);
        }
      }

      commentBatch = [];
    };

    while (await cursor.hasNext()) {
      const comment = await cursor.next();
      if (!comment) {
        break;
      }

      commentBatch.push(comment);

      if (commentBatch.length >= BATCH_SIZE) {
        await writeBatch();
      }
    }

    if (commentBatch.length > 0) {
      await writeBatch();
    }

    csv.end();

    archive.finalize();
  };
};
