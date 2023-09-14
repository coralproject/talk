import { scraper } from "./scraper";

describe("Scraper", () => {
  it("parses the JSON-LD data correctly", async () => {
    const html = `
    <script type="application/ld+json">
    {
      "@type": "Article",
      "@id": "https://coralproject.net/blog/working-with-user-stories-keeping-commenters-and-moderators-at-the-center-of-what-we-build/",
      "author": {
        "@type": "Person",
        "name": "sam"
      },
      "headline": "Working with User Stories: Keeping commenters and moderators at the center of what we build",
      "description": "We believe that the comments section can be a place where diverse voices come together to share opinions and experiences.",
      "datePublished": "2019-09-04T15:43:35+00:00",
      "dateModified": "2019-09-06T06:14:29+00:00",
      "image": {
        "@type": "ImageObject",
        "url": "https://coralproject.net/wp-content/uploads/2019/09/blog-hero.png",
        "width": 1440,
        "height": 1024
      },
      "articleSection": "Comments,Design,Moderation,Useful"
    }
    </script>
    `;

    expect(await scraper.parse("", html)).toEqual({
      author: "sam",
      description:
        "We believe that the comments section can be a place where diverse voices come together to share opinions and experiences.",
      image:
        "https://coralproject.net/wp-content/uploads/2019/09/blog-hero.png",
      modifiedAt: new Date("2019-09-06T06:14:29+00:00"),
      publishedAt: new Date("2019-09-04T15:43:35+00:00"),
      section: "Comments,Design,Moderation,Useful",
      title:
        "Working with User Stories: Keeping commenters and moderators at the center of what we build",
    });
  });
});
