import { findMediaLinks } from "./findMediaLinks";

it("can detect links", () => {
  const bodies = [
    // YouTube
    "http://www.youtube.com/watch?v=o3LJPaYBqgU",
    "http://youtube.com/watch?v=o3LJPaYBqgU",
    "http://youtu.be/o3LJPaYBqgU",
    "https://www.youtube.com/watch?v=o3LJPaYBqgU",
    "https://youtube.com/watch?v=o3LJPaYBqgU",
    "https://youtu.be/o3LJPaYBqgU",
    // Twitter
    "http://twitter.com/coralproject/status/1280903734478987265",
    "http://www.twitter.com/coralproject/status/1280903734478987265",
    "http://mobile.twitter.com/coralproject/status/1280903734478987265",
    "https://twitter.com/coralproject/status/1280903734478987265",
    "https://www.twitter.com/coralproject/status/1280903734478987265",
    "https://mobile.twitter.com/coralproject/status/1280903734478987265",
  ];

  for (const body of bodies) {
    const links = findMediaLinks(body);
    expect(links).toHaveLength(1);
    expect(links[0].url).toEqual(body);
  }
});

it("will force https on links without a scheme", () => {
  const bodies = [
    // YouTube
    "www.youtube.com/watch?v=o3LJPaYBqgU",
    "twitter.com/coralproject/status/1280903734478987265",
    "youtu.be/o3LJPaYBqgU",
    // Twitter
    "www.twitter.com/coralproject/status/1280903734478987265",
    "mobile.twitter.com/coralproject/status/1280903734478987265",
    "youtube.com/watch?v=o3LJPaYBqgU",
  ];

  for (const body of bodies) {
    const links = findMediaLinks(body);
    expect(links).toHaveLength(1);
    expect(links[0].url).toEqual(`https://${body}`);
  }
});
