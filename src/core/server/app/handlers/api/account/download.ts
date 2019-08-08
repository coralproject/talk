import archiver from "archiver";
import stringify from "csv-stringify";
import DataLoader from "dataloader";
import { Response } from "express";
import Joi from "joi";
import { kebabCase } from "lodash";
import { Db } from "mongodb";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { getLatestRevision } from "coral-server/models/comment";
import { Comment } from "coral-server/models/comment";
import { retrieveManyStories } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { decodeJWT, extractTokenFromRequest } from "coral-server/services/jwt";
import { verifyDownloadTokenString } from "coral-server/services/users/download/download";
import { RequestHandler } from "coral-server/types/express";
import { Request } from "coral-server/types/express";

const BATCH_SIZE = 100;
const USER_ID_LIMITER_TTL = "1d";

export type DownloadOptions = Pick<
  AppOptions,
  "mongo" | "redis" | "signingConfig" | "config"
>;

async function sendExport(
  mongo: Db,
  tenant: Tenant,
  user: Readonly<User>,
  latestContentDate: Date,
  res: Response
) {
  // Create the date formatter to format the dates for the CSV.
  const formatter = Intl.DateTimeFormat(tenant.locale, {
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
  const filename = `talk-${kebabCase(user.username)}-${kebabCase(
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
  ]);

  /**
   * writeAndFlushBatch will write the given batch of comments to the CSV and
   * flush out the batchfor the next run.
   */
  const writeAndFlushBatch = async () => {
    const stories = await getStories.loadMany(
      commentBatch.map(({ storyID }) => storyID)
    );

    for (let i = 0; i < commentBatch.length; i++) {
      const comment = commentBatch[i];
      const story = stories[i];
      if (!story) {
        continue;
      }

      const revision = getLatestRevision(comment);

      const commentID = comment.id;
      const createdAt = formatter.format(new Date(comment.createdAt));
      const storyURL = story.url;
      const commentURL = `${storyURL}?commentID=${commentID}`;
      const body = revision.body;

      csv.write([commentID, createdAt, storyURL, commentURL, body]);
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

export interface DownloadBody {
  token: string;
}

export const DownloadBodySchema = Joi.object().keys({
  token: Joi.string().trim(),
});

export const downloadHandler = ({
  mongo,
  redis,
  signingConfig,
  config,
}: DownloadOptions): RequestHandler => {
  const userIDLimiter = new RequestLimiter({
    redis,
    ttl: USER_ID_LIMITER_TTL,
    max: 1,
    prefix: "userID",
    config,
  });

  return async (req: Request, res, next) => {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;
    const tenant = coral.tenant!;

    // Get the fields from the body. Validate will throw an error if the body
    // does not conform to the specification.
    const { token }: DownloadBody = validate(DownloadBodySchema, req.body);

    // Decode the token so we can rate limit based on the user's ID.
    const { sub: userID } = decodeJWT(token);
    if (!userID) {
      return res.sendStatus(400);
    }

    await userIDLimiter.test(req, userID);

    try {
      const {
        token: { iat },
        user,
      } = await verifyDownloadTokenString(
        mongo,
        tenant,
        signingConfig,
        token,
        coral.now
      );

      // Only load comments since this download token was issued.
      const latestContentDate = new Date(iat * 1000);

      // Send the export down the response.
      await sendExport(mongo, tenant, user, latestContentDate, res);

      return;
    } catch (err) {
      return next(err);
    }
  };
};

export type DownloadCheckOptions = Pick<
  AppOptions,
  "mongo" | "redis" | "signingConfig" | "config"
>;

export const downloadCheckHandler = ({
  mongo,
  redis,
  signingConfig,
  config,
}: DownloadCheckOptions): RequestHandler => {
  const userIDLimiter = new RequestLimiter({
    redis,
    ttl: USER_ID_LIMITER_TTL,
    max: 1,
    prefix: "userID",
    config,
  });

  return async (req, res, next) => {
    try {
      // Tenant is guaranteed at this point.
      const coral = req.coral!;
      const tenant = coral.tenant!;

      const tokenString = extractTokenFromRequest(req, true);
      if (!tokenString) {
        return res.sendStatus(400);
      }

      const { sub: userID } = decodeJWT(tokenString);
      if (!userID) {
        return res.sendStatus(400);
      }

      await userIDLimiter.test(req, userID);

      await verifyDownloadTokenString(
        mongo,
        tenant,
        signingConfig,
        tokenString,
        coral.now
      );

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
