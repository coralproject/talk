import Logger from "bunyan";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import nunjucks from "nunjucks";
import { v4 as uuid } from "uuid";

interface Story {
  id: string;
  section?: string;
  mode?: string;
  amp?: boolean;
}

interface SSOUser {
  id: string;
  username: string;
  email: string;
  role?: string;
}

interface SSOConfig {
  secret: string;
  users: SSOUser[];
}

interface Site {
  port: number;
  coralURL: string;
  staticURI?: string;
  stories: Story[];
  sso?: SSOConfig;
  customCSSURL?: string;
  customFontsCSSURL?: string;
  containerClassName?: string;
}

interface Config {
  sites: Site[];
}

const computeStoryURL = (req: any, story: Story) => {
  const url = new URL(`/story/${story.id}`, `http://${req.headers.host}`);

  return url;
};

interface SSOTokenParams {
  jti: string;
  user: {
    id: string;
    email: string;
    username: string;
    role?: string;
  };
  iat: number;
  exp: number;
}

const createSSOToken = (secret: string, params: SSOTokenParams) => {
  const payload = {
    jti: params.jti,
    iat: params.iat,
    exp: params.exp,
    user: params.user,
  };

  const token = jwt.sign(payload, secret);

  return {
    token,
    payload,
  };
};

const createIdentifier = (length: number, lettersOnly = false) => {
  let result = "";
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < length; i++) {
    if (i % 2 === 0 && !lettersOnly) {
      const pick = Math.floor(Math.random() * 10);
      result += pick;
    } else {
      const index = Math.floor(Math.random() * alphabet.length);
      const pick = alphabet[index];

      result += pick;
    }
  }

  return result;
};

const getUser = (site: Site, userID: string) => {
  const user = site.sso?.users?.find((u) => u.id === userID);
  if (!user && site.sso?.users?.length > 0) {
    return site.sso?.users[0];
  }

  return user;
};

const computeIn30DaysSecs = (): number => {
  const nowSecs = Math.floor(Date.now() / 1000);
  const i30DaysSecs = 30 * 24 * 60 * 60;

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const in30Days = nowSecs + i30DaysSecs;

  return in30Days;
};

const startServer = async (logger: Logger, site: Site) => {
  const { port, coralURL, staticURI } = site;
  const app = express();

  nunjucks.configure("dev/host/src/views", { autoescape: true });

  app.use(cors());

  app.use("/static", express.static("dev/host/static"));

  app.get("/", (req, res) => {
    const countScriptURL = new URL("/assets/js/count.js", coralURL);

    const render = nunjucks.render("index.html", {
      title: `mst:${site.port}`,
      port: site.port,
      coralURL: site.coralURL,
      countScriptURL,
      stories: site.stories.map((s) => {
        return {
          url: computeStoryURL(req, s).href,
          name: `Story ${s.id}`,
          id: s.id,
          mode: s.mode ?? "COMMENTS",
        };
      }),
      ssoEnabled: site.sso,
    });
    res.send(render);
  });

  app.get("/ssotoken", (req, res) => {
    const now = Math.floor(Date.now() / 1000);
    const in30Days = computeIn30DaysSecs();

    const id = createIdentifier(12);
    const domain = createIdentifier(8, true);

    const user: SSOUser = {
      id: uuid(),
      username: `sso-user-${id}`,
      email: `sso-user-${id}@${domain}.com`,
      role: "COMMENTER",
    };

    const secret = site.sso ? site.sso.secret : "secret";
    const options = {
      jti: uuid(),
      iat: now,
      exp: in30Days,
      user,
    };

    const { token, payload } = createSSOToken(secret, options);

    const render = nunjucks.render("ssotoken.html", {
      title: `mst:${site.port} - ssoToken`,
      secret,
      token,
      tokenPayload: JSON.stringify(payload, null, 2),
      iat: new Date(now * 1000).toISOString(),
      exp: new Date(in30Days * 1000).toISOString(),
    });

    res.send(render);
  });

  app.get("/story/:storyID", (req, res) => {
    const userID = req.query.userID as string;
    const storyID = req.params.storyID;
    const story = site.stories.find((s) => s.id === storyID);
    if (!story) {
      res.sendStatus(404);
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const in30Days = computeIn30DaysSecs();

    const ssoEnabled =
      site.sso &&
      site.sso.secret &&
      site.sso.users &&
      site.sso.users.length > 0;
    const user = getUser(site, userID);

    const ssoToken = ssoEnabled
      ? createSSOToken(site.sso.secret, {
          jti: uuid(),
          iat: now,
          exp: in30Days,
          user,
        })
      : null;

    const coralSrcURL = new URL(
      "/assets/js/embed.js",
      staticURI ? staticURI : coralURL
    );
    const url = computeStoryURL(req, story);

    const template = story.amp ? "amp.html" : "story.html";
    const render = nunjucks.render(template, {
      title: `mst:${port}/stories/${storyID}`,
      storyID: story.id,
      url: url.href,
      coralURL,
      coralSrcURL: coralSrcURL.href,
      storyMode: story.mode ?? "COMMENTS",
      ssoEnabled,
      ssoUser: user,
      ssoUsers: site.sso?.users,
      accessToken: ssoEnabled ? ssoToken.token : undefined,
      customCSSURL: site.customCSSURL,
      customFontsCSSURL: site.customFontsCSSURL,
      containerClassName: site.containerClassName,
      section: story.section,
    });
    res.send(render);
  });

  app.listen(port, () => {
    logger.info({ port }, "host server is listening");
  });
};

const createLogger = () => {
  return Logger.createLogger({
    name: "coral-dev-host",
    src: true,
    level: "debug",
    color: true,
  });
};

const run = () => {
  const logger = createLogger();
  const configRaw = readFileSync("dev/host/config.json").toString();
  const config = JSON.parse(configRaw) as Config;

  config.sites.forEach((s) => {
    startServer(logger, s);
  });
};

run();
