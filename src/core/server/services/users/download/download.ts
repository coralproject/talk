import archiver from "archiver";
import stringify from "csv-stringify";
import DataLoader from "dataloader";
import { Response } from "express";
import htmlToText from "html-to-text";
import { kebabCase } from "lodash";
import { Db } from "mongodb";

import { createDateFormatter } from "coral-common/date";
import { mapErrorsToNull } from "coral-server/helpers/dataloader";
import { Comment, getLatestRevision } from "coral-server/models/comment";
import {
  getURLWithCommentID,
  retrieveManyStories,
} from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";

const BATCH_SIZE = 100;

export async function sendUserDownload(
  res: Response,
  mongo: Db,
  tenant: Tenant,
  user: Readonly<User>,
  latestContentDate: Date
) {
  // Create the date formatter to format the dates for the CSV.
  const formatter = createDateFormatter(tenant.locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  // Create a DataLoader to load stories for each batch.
  const getStories = new DataLoader((ids: string[]) =>
    retrieveManyStories(mongo, tenant.id, ids)
  );

  // Create a cursor to iterate over the user's comment's in order.
  const cursor = mongo
    .collection<Readonly<Comment>>("comments")
    .find({
      tenantID: tenant.id,
      authorID: user.id,
      createdAt: {
        $lt: latestContentDate,
      },
    })
    .sort({ createdAt: 1 });

  // Collect all the user's comments in batches.
  let commentBatch: Array<Readonly<Comment>> = [];

  // Generate the filename of the file that the user will download.
  const filename = `coral-${kebabCase(user.username)}-${kebabCase(
    formatter.format(latestContentDate)
  )}.zip`;

  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename=${filename}`,
  });

  // Create the zip archive we'll use to write all the exported files to.
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  // Pipe this to the response writer directly.
  archive.pipe(res);

  // Create all the csv writers that'll write the data to the archive.
  const csv = stringify();

  // Add all the streams as files to the archive.
  archive.append(csv, { name: "comments-export/my_comments.csv" });

  csv.write([
    "Comment ID",
    "Published Timestamp",
    "Article URL",
    "Comment URL",
    "Comment Text",
    "Media",
  ]);

  /**
   * writeAndFlushBatch will write the given batch of comments to the CSV and
   * flush out the batchfor the next run.
   */
  const writeAndFlushBatch = async () => {
    const stories = await getStories
      .loadMany(commentBatch.map(({ storyID }) => storyID))
      .then(mapErrorsToNull);

    for (let i = 0; i < commentBatch.length; i++) {
      const comment = commentBatch[i];
      const story = stories[i];
      if (!story || story instanceof Error) {
        continue;
      }

      const revision = getLatestRevision(comment);

      const createdAt = formatter.format(new Date(comment.createdAt));
      const body = htmlToText.fromString(revision.body);
      const commentURL = getURLWithCommentID(story.url, comment.id);

      const media = revision.media
        ? `${revision.media.type}: ${revision.media.url}`
        : "";

      csv.write([comment.id, createdAt, story.url, commentURL, body, media]);
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
      await writeAndFlushBatch();
    }
  }

  if (commentBatch.length > 0) {
    await writeAndFlushBatch();
  }

  csv.end();

  // Mark the end of adding files, no more files can be added after this. Once
  // all the stream readers have finished writing, and have closed, the
  // archiver will close which will finish the HTTP request.
  await archive.finalize();
}
