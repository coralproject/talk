import express, { RequestHandler } from "express";
import nunjucks from "nunjucks";
import fs from "fs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

interface Story {
  id: string;
  section?: string;
  sectionOverride?: string;
  mode?: string;
  amp?: boolean;
  delayMs?: number;
}

interface SSOUser {
  id: string;
  username: string;
  email: string;
  role?: string;
  badges?: string[];
  avatar?: string;
}

interface SSOConfig {
  secret: string;
  users: SSOUser[];
}

interface Site {
  port: number;
  coralURL: string;
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
  user: SSOUser;
  iat: number;
  exp: number;
}

const createSSOToken = (secret: string, params: SSOTokenParams) => {
  const payload: any = {
    jti: params.jti,
    iat: params.iat,
    exp: params.exp,
    user: params.user,
  };

  const { user } = params;

  if (user.badges && Array.isArray(user.badges) && user.badges.length > 0) {
    payload.badges = user.badges;
  }

  if (user.avatar) {
    payload.avatar = user.avatar;
  }

  const token = jwt.sign(payload, secret);

  return {
    token,
    payload,
  };
};

const createIdentifier = (length: number, lettersOnly = false) => {
  let result = "";
  var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < length; i++) {
    if (i % 2 == 0 && !lettersOnly) {
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

const startServer = async (site: Site) => {
  const { port, coralURL } = site;
  const app = express();

  nunjucks.configure("src/views", { autoescape: true });

  app.use("/static", express.static("./static"));

  app.get("/", (req, res) => {
    // Stories that don't load in after some time to replicate
    // lazy loading behaviour of The Verge's river of articles
    const nonDynamicallyLoadedStories = site.stories
      .filter((s) => !s.delayMs || s.delayMs === 0)
      .map((s) => {
        return {
          url: computeStoryURL(req, s).href,
          name: `Story ${s.id}`,
          id: s.id,
          mode: s.mode ?? "COMMENTS",
        };
      });

    const dynamicStories = site.stories
      .filter((s) => s.delayMs > 0)
      .map((s) => {
        return {
          url: computeStoryURL(req, s).href,
          name: `Story ${s.id}`,
          id: s.id,
          mode: s.mode ?? "COMMENTS",
          delay: s.delayMs,
        };
      });

    const render = nunjucks.render("index.html", {
      title: `mst:${site.port}`,
      port: site.port,
      coralURL: site.coralURL,
      stories: nonDynamicallyLoadedStories,
      dynamicStories,
      ssoEnabled: site.sso,
    });
    res.send(render);
  });

  app.get("/ssotoken", (req, res) => {
    const now = Math.floor(Date.now() / 1000);
    const in30Days = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

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
      token: token,
      tokenPayload: JSON.stringify(payload, null, 2),
      iat: new Date(now * 1000).toISOString(),
      exp: new Date(in30Days * 1000).toISOString(),
    });

    res.send(render);
  });

  const createStoryHandler = (titleTemplate: string): RequestHandler => {
    return (req, res) => {
      const userID = req.query.userID as string;
      const storyID = req.params.storyID;
      const story = site.stories.find((s) => s.id === storyID);
      if (!story) {
        res.sendStatus(404);
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const in30Days = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

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

      const coralSrcURL = new URL("/assets/js/embed.js", coralURL);
      const url = computeStoryURL(req, story);

      const computedTitle = titleTemplate
        .replace("<$PORT>", port.toString())
        .replace("<$STORY_ID>", storyID);

      const template = story.amp ? "amp.html" : "story.html";
      const render = nunjucks.render(template, {
        title: computedTitle,
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
        sectionOverride: story.sectionOverride,
      });
      res.send(render);
    };
  };

  app.get(
    "/story/:storyID",
    createStoryHandler("mst:<$PORT>/stories/<$STORY_ID>")
  );
  app.get(
    "/story/alt/:storyID",
    createStoryHandler("mst:<$PORT>/stories/alt/<$STORY_ID>")
  );

  app.listen(port, () => {
    console.log(`listening on port ${port}...`);
  });
};

const run = () => {
  const configRaw = fs.readFileSync("config.json").toString();
  const config = JSON.parse(configRaw) as Config;

  config.sites.forEach((s) => {
    startServer(s);
  });
};

run();
