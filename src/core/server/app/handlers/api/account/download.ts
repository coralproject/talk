import archiver from "archiver";
import stringify from "csv-stringify";
import DataLoader from "dataloader";
import { Db } from "mongodb";

import { AppOptions } from "coral-server/app";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { retrieveManyStories } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { decodeJWT, extractTokenFromRequest } from "coral-server/services/jwt";
import { verifyDownloadTokenString } from "coral-server/services/users/download/download";
import { RequestHandler } from "coral-server/types/express";
import { Request } from "coral-server/types/express";

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
const USER_ID_LIMITER_TTL = "1d";

export type DownloadOptions = Pick<
  AppOptions,
  "mongo" | "redis" | "signingConfig" | "config"
>;

async function createExportedContent(
  mongo: Db,
  tenant: Tenant,
  authorID: string,
  res: any
) {
  const tenantID = tenant.id;
  const comments = mongo.collection<Readonly<Comment>>("comments");

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
    "Published Timestamp",
    "Article URL",
    "Comment URL",
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

      const orderedRevisions = comment.revisions.sort(
        (a: Revision, b: Revision) => {
          const bDate = new Date(b.createdAt);
          const aDate = new Date(a.createdAt);
          return bDate.getTime() - aDate.getTime();
        }
      );

      const latestRevision = orderedRevisions[0];

      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const formattedDate = Intl.DateTimeFormat(
        [tenant.locale, "en-US"],
        options
      ).format(new Date(comment.createdAt));

      const commentID = comment.id;
      const storyUrl = story.url;
      const commentUrl = `${storyUrl}?commentID=${commentID}`;
      const body = latestRevision.body;

      csv.write([commentID, formattedDate, storyUrl, commentUrl, body]);
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
  await archive.finalize();
}

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
    const now = coral.now;
    const tenant = coral.tenant!;
    const body = req.body;

    const rawToken = body.token;
    if (!rawToken) {
      return res.sendStatus(400);
    }
    if (Array.isArray(rawToken)) {
      return res.sendStatus(400);
    }

    const tokenString: string = rawToken;
    if (!tokenString) {
      return res.sendStatus(400);
    }

    const { sub: userID } = decodeJWT(tokenString);
    if (!userID) {
      return res.sendStatus(400);
    }

    await userIDLimiter.test(req, userID);

    try {
      const { sub: authorID } = await verifyDownloadTokenString(
        mongo,
        tenant,
        signingConfig,
        tokenString,
        now
      );

      await createExportedContent(mongo, tenant, authorID, res);

      return res;
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
